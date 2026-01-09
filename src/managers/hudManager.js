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
            xpText: document.getElementById('xp-bar-text'),
            standardUI: document.getElementById('standard-ui'),
            endlessUI: document.getElementById('endless-ui'),
            endlessKillCount: document.getElementById('endless-kill-count'),
            endlessDangerValue: document.getElementById('endless-danger-value'),
            // Wave Announcement
            waveAnnouncement: document.getElementById('wave-announcement'),
            waveAnnouncementNumber: document.querySelector('#wave-announcement .wave-number'),
            waveAnnouncementName: document.querySelector('#wave-announcement .wave-name')
        };

        this.scene.events.on('endless-mode-started', this.setEndlessMode, this);
        this.scene.events.on('wave-changed', (payload) => {
            this.showWaveAnnouncement(payload.index, payload.name);
            this.setBossWave(payload.isBossWave, payload.index);
        }, this);
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

        // Reset UI visibility
        if (this.elements.standardUI) this.elements.standardUI.style.display = 'block';
        if (this.elements.endlessUI) this.elements.endlessUI.style.display = 'none';
        if (this.elements.timer) {
            this.elements.timer.classList.remove('endless-timer');
            this.elements.timer.style.color = '';
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

        // Sync endless kill count too if visible
        if (this.elements.endlessKillCount) {
            this.elements.endlessKillCount.textContent = kills;
        }

        // Update danger level based on endless wave
        if (this.scene.isEndlessMode && this.elements.endlessDangerValue) {
            this.updateDangerLevel(wave);
        }
    }

    updateDangerLevel(wave) {
        if (!this.elements.endlessDangerValue) return;

        // Map endless waves to descriptive labels
        const relativeWave = wave - (this.scene.mapConfig?.waves?.length || 0);
        let label = 'ESTÁVEL';
        let color = '#ffd700';

        if (relativeWave > 20) { label = 'APOCALÍPTICO'; color = '#ff0000'; }
        else if (relativeWave > 15) { label = 'SANGRENTO'; color = '#ff3333'; }
        else if (relativeWave > 10) { label = 'CRÍTICO'; color = '#ff6600'; }
        else if (relativeWave > 5) { label = 'HOSTIL'; color = '#ff9900'; }
        else if (relativeWave > 0) { label = 'ALERTA'; color = '#ffd700'; }

        this.elements.endlessDangerValue.textContent = label;
        this.elements.endlessDangerValue.style.color = color;
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
            this.elements.timer.classList.add('endless-timer');
        }

        if (this.elements.standardUI) this.elements.standardUI.style.display = 'none';
        if (this.elements.endlessUI) this.elements.endlessUI.style.display = 'flex';

        // Initial update for kill count
        if (this.elements.endlessKillCount && this.scene.totalKills !== undefined) {
            this.elements.endlessKillCount.textContent = this.scene.totalKills;
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

    showWaveAnnouncement(number, name) {
        if (!this.elements.waveAnnouncement) return;

        // Reset animation if already showing
        this.elements.waveAnnouncement.classList.remove('show', 'hidden');
        void this.elements.waveAnnouncement.offsetWidth; // Force reflow

        // Set content
        if (this.elements.waveAnnouncementNumber) {
            this.elements.waveAnnouncementNumber.textContent = `ONDA ${number}`;
        }
        if (this.elements.waveAnnouncementName) {
            this.elements.waveAnnouncementName.textContent = name;
        }

        // Show
        this.elements.waveAnnouncement.classList.add('show');

        // Play SFX if available
        if (this.scene.audio) {
            this.scene.audio.play('levelup', { volume: 0.5 }); // Correct key from audio.config.js
        }

        // Hide after animation (approx 4s in CSS)
        setTimeout(() => {
            if (this.elements.waveAnnouncement) {
                this.elements.waveAnnouncement.classList.remove('show');
                this.elements.waveAnnouncement.classList.add('hidden');
            }
        }, 4000);
    }
}
