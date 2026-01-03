export class MapCompletedUIManager {
    constructor(scene) {
        this.scene = scene;
        this.screen = document.getElementById('map-completed');
        this.startButton = document.getElementById('start-endless-mode');

        this.startButton.addEventListener('click', () => {
            this.scene.isEndlessMode = true;
            this.scene.events.emit('endless-mode-started');
            this.hide();
            if (this.scene.bootstrap && this.scene.bootstrap.uiFlow) {
                this.scene.bootstrap.uiFlow.resumeGame();
            } else {
                this.scene.scene.resume();
            }
        });
    }

    show() {
        // Sync stats before showing
        const timeSpan = document.getElementById('final-survival-time');
        const levelSpan = document.getElementById('final-level-completed');

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

        if (this.scene.bootstrap && this.scene.bootstrap.uiFlow) {
            this.scene.bootstrap.uiFlow.openScreen('map-completed');
        } else {
            this.scene.scene.pause();
        }
    }

    hide() {
        this.screen.classList.remove('active');
    }
}
