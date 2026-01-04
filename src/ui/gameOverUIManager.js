export class GameOverUIManager {
    constructor(scene) {
        this.scene = scene;
        this.screen = document.getElementById('game-over');
    }

    show() {
        // Helper function for time formatting
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        };

        // Get DOM elements
        const timeSpan = document.getElementById('survival-time');
        const levelSpan = document.getElementById('final-level');
        const enemiesSpan = document.getElementById('enemies-defeated');
        const endlessStatsContainer = document.getElementById('endless-mode-stats');
        const endlessTimeSpan = document.getElementById('endless-survival-time');

        // Populate standard stats
        if (timeSpan) {
            timeSpan.textContent = formatTime(this.scene.stageSystem.totalPlayTime || 0);
        }
        if (levelSpan) {
            levelSpan.textContent = this.scene.xpSystem.currentLevel || 1;
        }
        if (enemiesSpan) {
            enemiesSpan.textContent = this.scene.totalEnemiesDefeated || 0;
        }

        // Handle Endless Mode stats
        if (this.scene.isEndlessMode) {
            if (endlessStatsContainer) endlessStatsContainer.style.display = 'block';
            if (endlessTimeSpan) {
                endlessTimeSpan.textContent = formatTime(this.scene.stageSystem.survivalTimer || 0);
            }
        } else {
            if (endlessStatsContainer) endlessStatsContainer.style.display = 'none';
        }

        this.screen.classList.add('active');

        if (this.scene.bootstrap && this.scene.bootstrap.uiFlow) {
            this.scene.bootstrap.uiFlow.openScreen('game-over');
        } else {
            this.scene.scene.pause();
        }

        // Save logic? Usually handled in SceneBootstrap or SaveManager
        if (this.scene.saveManager) {
            this.scene.saveManager.addCoins(this.scene.coins || 0);
            this.scene.saveManager.save();
        }
    }

    hide() {
        this.screen.classList.remove('active');
    }
}
