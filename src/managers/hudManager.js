export class HUDManager {
    constructor(scene) {
        this.scene = scene;
        this.elements = {
            container: document.getElementById('game-ui'),
            timer: document.getElementById('game-timer'),
            waveCount: document.getElementById('wave-count'),
            enemyCount: document.getElementById('enemy-count'),
            killCount: document.getElementById('kill-count'),
            waveDisplay: document.getElementById('wave-display'),
            healthFill: document.getElementById('health-bar-fill'),
            healthText: document.getElementById('health-text'),
            xpFill: document.getElementById('xp-bar-fill'),
            xpText: document.getElementById('xp-bar-text')
        };

        this.scene.events.on('endless-mode-started', this.setEndlessMode, this);
    }

    show() {
        if (this.elements.container) {
            this.elements.container.style.display = 'block';
        }
    }

    hide() {
        if (this.elements.container) this.elements.container.style.display = 'none';
        // Reset styles that might have changed
        if (this.elements.timer) this.elements.timer.style.color = '';
    }

    reset() {
        this.hide();
        this.updateTimer(this.scene.mapConfig ? this.scene.mapConfig.duration : 0);
        this.updateWaveInfo(1, 0, 0);
        this.updateHealth(100, 100);
        this.updateXP(0, 100, 1);

        // Remove boss wave styling
        if (this.elements.waveDisplay) {
            this.elements.waveDisplay.classList.remove('boss-wave');
            const waveText = this.elements.waveDisplay.querySelector('span');
            if (waveText) waveText.innerHTML = 'ONDA <span id="wave-count">1</span>';
            this.elements.waveCount = document.getElementById('wave-count');
        }
    }

    updateHealth(current, max) {
        const percent = Math.max(0, (current / max) * 100);
        if (this.elements.healthFill) {
            this.elements.healthFill.style.width = `${percent}%`;

            // Color logic
            if (percent > 50) {
                this.elements.healthFill.style.backgroundColor = '#4CAF50';
            } else if (percent > 25) {
                this.elements.healthFill.style.backgroundColor = '#FFA500';
            } else {
                this.elements.healthFill.style.backgroundColor = '#FF3333';
            }
        }
        if (this.elements.healthText) {
            this.elements.healthText.textContent = `${Math.ceil(current)}/${max}`;
        }
    }

    updateXP(current, nextLevelXP, level) {
        const percent = Math.min(100, Math.max(0, (current / nextLevelXP) * 100));
        if (this.elements.xpFill) {
            this.elements.xpFill.style.width = `${percent}%`;
        }
        if (this.elements.xpText) {
            this.elements.xpText.textContent = `NÍVEL ${level}`;
        }
    }

    updateWaveInfo(wave, enemies, kills) {
        if (this.elements.waveCount) this.elements.waveCount.textContent = wave;
        if (this.elements.enemyCount) this.elements.enemyCount.textContent = enemies;
        if (this.elements.killCount) this.elements.killCount.textContent = kills;
    }

    updateTimer(seconds, isSuddenDeath = false) {
        if (!this.elements.timer) return;

        if (this.scene.isEndlessMode) {
            const timeToShow = Math.ceil(Math.max(0, seconds));
            const mins = Math.floor(timeToShow / 60).toString().padStart(2, '0');
            const secs = (timeToShow % 60).toString().padStart(2, '0');
            this.elements.timer.textContent = `${mins}:${secs}`;
            return;
        }

        if (isSuddenDeath) {
            this.elements.timer.style.color = 'red';
            this.elements.timer.textContent = "SUDDEN DEATH";
            return;
        }

        const timeToShow = Math.ceil(Math.max(0, seconds));
        const mins = Math.floor(timeToShow / 60).toString().padStart(2, '0');
        const secs = (timeToShow % 60).toString().padStart(2, '0');
        this.elements.timer.textContent = `${mins}:${secs}`;
    }

    setEndlessMode() {
        if (this.elements.timer) {
            this.elements.timer.style.color = '#ff8c00'; // Deep orange
        }

        if (this.elements.waveDisplay) {
            const waveText = this.elements.waveDisplay.querySelector('span');
            if (waveText) {
                waveText.innerHTML = 'ENDLESS ONDA <span id="wave-count">1</span>';
                this.elements.waveCount = document.getElementById('wave-count');
            }
        }
    }

    setBossWave(isBossWave, wave) {
        if (!this.elements.waveDisplay) return;

        const waveText = this.elements.waveDisplay.querySelector('span');
        if (!waveText) return;

        if (isBossWave) {
            this.elements.waveDisplay.classList.add('boss-wave');
            waveText.innerHTML = `<span style="color: #ff4444; font-weight: bold;">BOSS</span> ONDA <span id="wave-count">${wave}</span>`;
            // Re-fetch waveCount because we replaced innerHTML
            this.elements.waveCount = document.getElementById('wave-count');
        } else {
            this.elements.waveDisplay.classList.remove('boss-wave');
            waveText.innerHTML = `ONDA <span id="wave-count">${wave}</span>`;
            this.elements.waveCount = document.getElementById('wave-count');
        }
    }
}
