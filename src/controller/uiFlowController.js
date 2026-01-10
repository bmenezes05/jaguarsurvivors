export class UIFlowController {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;

        this.upgradeUI = scene.upgradeUIManager;
        this.legendaryUI = scene.legendaryUIManager;
        this.gameOverUI = scene.gameOverUIManager;

        // Centralized pause state management
        this.activeScreens = new Set();

        // Sequential Reward Queue
        this.rewardQueue = [];
        this.isProcessingQueue = false;
    }

    onLevelUp() {
        this.queueReward({
            id: 'upgrade',
            show: () => this.upgradeUI.show()
        });
    }

    onLegendaryDrop(rewards) {
        this.queueReward({
            id: 'legendary',
            show: () => this.legendaryUI.show(rewards)
        });
    }

    queueReward(reward) {
        this.rewardQueue.push(reward);
        this.processQueue();
    }

    processQueue() {
        if (this.isProcessingQueue || this.rewardQueue.length === 0) return;

        // Don't interrupt game over
        if (this.activeScreens.has('game-over')) return;

        this.isProcessingQueue = true;
        const reward = this.rewardQueue.shift();

        this.openScreen(reward.id);
        reward.show();
    }

    onPlayerDied() {
        // Game over clears queue and takes priority
        this.rewardQueue = [];
        this.openScreen('game-over');
        this.gameOverUI.show();
    }

    openScreen(screenId) {
        this.activeScreens.add(screenId);
        this.scene.scene.pause();
    }

    closeScreen(screenId) {
        if (this.activeScreens) {
            this.activeScreens.delete(screenId);
        }

        // If it was a reward screen, allow next one in queue
        if (screenId === 'upgrade' || screenId === 'legendary') {
            this.isProcessingQueue = false;
            // Short delay to prevent framework flicker or immediate input issues
            setTimeout(() => {
                if (this.scene && this.scene.sys) {
                    this.processQueue();
                }
            }, 50);
        }

        if (this.activeScreens && this.activeScreens.size === 0 && this.rewardQueue?.length === 0) {
            this.scene.scene.resume();
        }
    }

    togglePause() {
        if (!this.activeScreens) return;

        // If currently paused explicitly by us (the pause screen is open), resume
        if (this.activeScreens.has('pause')) {
            this.resume();
            return;
        }

        // Otherwise, prevent pause if other screens are active (like upgrades, game over)
        if (this.activeScreens.size > 0 || this.rewardQueue?.length > 0) return;

        if (this.scene.scene.isPaused('GameScene')) {
            // Safety fallback if scene is paused but we don't know why
            this.resume();
        } else {
            this.scene.scene.pause();
            if (this.scene.pauseUIManager) {
                this.scene.pauseUIManager.show();
                this.activeScreens.add('pause');
            }
        }
    }

    resume() {
        if (!this.activeScreens) return;

        if (this.scene.pauseUIManager) {
            this.scene.pauseUIManager.hide();
        }

        // Remove pause from active screens if it was there
        this.activeScreens.delete('pause');

        if (this.activeScreens.size === 0 && this.rewardQueue?.length === 0) {
            this.scene.scene.resume();
        }
    }

    destroy() {
        if (this.activeScreens) {
            this.activeScreens.clear();
            this.activeScreens = null;
        }
        this.rewardQueue = [];
        this.isProcessingQueue = false;
        console.debug('UIFlowController destroyed');
    }
}
