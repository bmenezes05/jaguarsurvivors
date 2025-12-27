export class BossUIManager {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.fill = null;
        this.nameText = null;
        this.healthText = null;
        this.currentBoss = null;

        this.createUI();
    }

    createUI() {
        const gameUI = document.getElementById('game-ui');
        if (!gameUI) return;

        // Limpa se já existir (para evitar duplicatas em re-init)
        const old = document.getElementById('boss-health-container');
        if (old) old.remove();

        const bossContainer = document.createElement('div');
        bossContainer.id = 'boss-health-container';
        bossContainer.style.display = 'none';

        bossContainer.innerHTML = `
            <div class="boss-name">BOSS NAME</div>
            <div class="boss-bar-bg">
                <div class="boss-bar-fill"></div>
                <div class="boss-health-text">100/100</div>
            </div>
        `;

        gameUI.appendChild(bossContainer);

        this.container = bossContainer;
        this.nameText = bossContainer.querySelector('.boss-name');
        this.fill = bossContainer.querySelector('.boss-bar-fill');
        this.healthText = bossContainer.querySelector('.boss-health-text');
    }

    /**
     * Foca o HUD em um chefe específico.
     */
    show(boss) {
        if (!boss) return;

        // Se trocou de chefe, atualiza o nome
        if (this.currentBoss !== boss) {
            this.nameText.textContent = (boss.enemy?.name || boss.name || 'BOSS').toUpperCase();
        }

        this.currentBoss = boss;
        this.container.style.display = 'flex';
        this.container.classList.add('active');

        // DO NOT call update() here - this was causing infinite recursion!
        // The boss flow controller will call update() separately when needed.
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            this.container.classList.remove('active');
        }
        this.currentBoss = null;
    }

    update() {
        if (!this.currentBoss || !this.currentBoss.isActive || this.currentBoss.health <= 0) {
            // Boss is dead or inactive - hide the UI
            // DO NOT call show() here - let boss flow controller manage this!
            this.hide();
            return;
        }

        const max = this.currentBoss.maxHealth || 100;
        const current = Math.max(0, this.currentBoss.health);
        const percent = (current / max) * 100;

        if (this.fill) this.fill.style.width = `${percent}%`;
        if (this.healthText) this.healthText.textContent = `${Math.ceil(current)}/${Math.ceil(max)}`;
    }
}
