export class GameOverUIManager {
    constructor(scene) {
        this.scene = scene;
        this.screen = document.getElementById('game-over');
    }

    show() {
        // Sync stats before showing
        const timeSpan = document.getElementById('survival-time');
        const levelSpan = document.getElementById('final-level');

        if (timeSpan) {
            const time = this.scene.stageSystem.totalPlayTime || 0;
            const mins = Math.floor(time / 60).toString().padStart(2, '0');
            const secs = Math.floor(time % 60).toString().padStart(2, '0');
            timeSpan.textContent = `${mins}:${secs}`;
        }

        if (levelSpan) {
            levelSpan.textContent = this.scene.xpSystem.currentLevel || 1;
        }

        this.screen.classList.add('active');
        this.scene.scene.pause();

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
