export class UIFlowController {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;

        this.upgradeUI = scene.upgradeUIManager;
        this.legendaryUI = scene.legendaryUIManager;
        this.gameOverUI = scene.gameOverUIManager;
    }

    onLevelUp() {
        this.scene.scene.pause();
        this.upgradeUI.show();
    }

    onLegendaryDrop(item) {
        this.scene.scene.pause();
        this.legendaryUI.show(item);
    }

    onPlayerDied() {
        this.scene.scene.pause();
        this.gameOverUI.show();
    }

    togglePause() {
        // Prevent pausing/unpausing if critical UI is open
        if (document.getElementById('upgrade-screen').classList.contains('active') ||
            document.getElementById('game-over').classList.contains('active') ||
            (document.getElementById('legendary-selection') && document.getElementById('legendary-selection').style.display === 'flex')) {
            return;
        }

        const pauseScreen = document.getElementById('pause-screen');
        if (this.scene.scene.isPaused('GameScene')) {
            // Only resume if pause screen was the reason
            if (pauseScreen.classList.contains('active')) {
                this.scene.scene.resume();
                pauseScreen.classList.remove('active');
            }
        } else {
            this.scene.scene.pause();
            pauseScreen.classList.add('active');
        }
    }

    resume() {
        this.scene.scene.resume();
        document.getElementById('pause-screen').classList.remove('active');
    }
}
