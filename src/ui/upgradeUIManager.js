

/**
 * UpgradeUIManager - Handles the high-fidelity level-up screen using standard DOM
 * Features:
 * - Responsive Card Grid
 * - Real-time Player Stats Panel with bars
 * - Premium VFX & Animations (CSS-driven)
 * - Addictive Audio Integration
 */
export class UpgradeUIManager {
    constructor(scene) {
        this.scene = scene;
        this.screen = document.getElementById('upgrade-screen');
        this.optionsContainer = document.getElementById('upgrade-options');
        this.statsList = document.getElementById('upgrade-stats-list');
        this.levelNum = document.getElementById('upgrade-level-num');
    }

    show() {
        if (!this.screen) {
            // Fallback if not in HTML (shouldn't happen with current setup)
            this.screen = document.getElementById('upgrade-screen');
        }

        this.isSelecting = false; // Reset selection lock

        const upgrades = this.scene.upgradeManager.getSmartUpgradeOptions(3);
        const playerLevel = this.scene.xpSystem ? this.scene.xpSystem.currentLevel : 1;
        // ... (rest of show logic is fine, let's keep the block consistent or just replace the start)
        this.screen.classList.add('active');

        // Update header
        if (this.levelNum) this.levelNum.innerText = playerLevel;

        // Populate Upgrades
        this.optionsContainer.innerHTML = '';
        upgrades.forEach((upgrade, index) => {
            const card = this.createCard(upgrade, index);
            this.optionsContainer.appendChild(card);
        });

        // Populate Stats
        this.updateStatsPanel();

        // Play level up sound directly to avoid event loop
        if (this.scene.audio) {
            this.scene.audio.play('levelup');
        }
    }

    // ... createCard ...

    selectUpgrade(upgrade) {
        if (this.isSelecting) return;
        this.isSelecting = true;

        this.scene.upgradeManager.applyUpgrade(upgrade);
        this.hide();
    }

    createCard(upgrade, index) {
        const card = document.createElement('div');
        card.className = `upgrade-card ${upgrade.isEvolution ? 'evolution' : ''}`;

        // Staggered animation entrance
        card.style.animationDelay = `${index * 0.15}s`;

        // Icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'upgrade-icon';
        if (upgrade.spriteKey) {
            iconContainer.style.backgroundImage = `url(src/assets/images/${upgrade.spriteKey}.png)`;
        } else {
            iconContainer.innerText = upgrade.icon || '⭐';
        }

        // Title & Description
        const title = document.createElement('h2');
        title.innerText = upgrade.name;

        const desc = document.createElement('p');
        desc.innerText = upgrade.desc;

        // Type Badge
        const badge = document.createElement('div');
        badge.className = 'upgrade-type-badge';
        badge.innerText = this.getTypeLabel(upgrade);

        card.append(iconContainer, title, desc, badge);

        // Interactions
        card.onmouseenter = () => this.scene.events.emit('ui-hover');
        card.onclick = () => {
            this.scene.events.emit('ui-click');
            this.selectUpgrade(upgrade);
        };

        return card;
    }

    updateStatsPanel() {
        if (!this.statsList || !this.scene.player) return;

        const stats = this.scene.player.stats;
        this.statsList.innerHTML = '';

        const visibleStats = [
            { label: 'Dano', value: Math.round(stats.damageStat.totalMultiplier * 100) + '%', pct: stats.damageStat.totalMultiplier / 3 },
            { label: 'Vel. Ataque', value: Math.round(stats.attackSpeedStat.totalMultiplier * 100) + '%', pct: stats.attackSpeedStat.totalMultiplier / 3 },
            { label: 'Vida Máxima', value: Math.round(stats.maxHealth), pct: stats.maxHealth / 1500 },
            { label: 'Regen. HP', value: stats.hpRegen.toFixed(1) + '/s', pct: stats.hpRegen / 10 },
            { label: 'Vel. Movimento', value: Math.round(stats.moveSpeedStat.totalMultiplier * 100) + '%', pct: stats.moveSpeedStat.totalMultiplier / 2 },
            { label: 'Alcance Coleta', value: Math.round(stats.pickupRadiusStat.getValue()), pct: stats.pickupRadiusStat.getValue() / 600 },
            { label: 'Chance Crítico', value: Math.round(stats.critChanceStat.getValue() * 100) + '%', pct: stats.critChanceStat.getValue() },
            { label: 'Dano Crítico', value: Math.round(stats.criticalDamageStat.getValue() * 100) + '%', pct: stats.criticalDamageStat.getValue() / 5 },
            { label: 'Evasão', value: Math.round(stats.evasionStat.getValue() * 100) + '%', pct: stats.evasionStat.getValue() },
            { label: 'Life Steal', value: Math.round(stats.lifeStealStat.getValue() * 100) + '%', pct: stats.lifeStealStat.getValue() / 0.5 },
            { label: 'Vel. Dash', value: Math.round(stats.dashSpeedStat.totalMultiplier * 100) + '%', pct: stats.dashSpeedStat.totalMultiplier / 5 },
            { label: 'Recarga Dash', value: (stats.dashCooldown / 1000).toFixed(1) + 's', pct: 1 - (stats.dashCooldown / 2000) },
            { label: 'Área', value: Math.round(stats.areaStat.totalMultiplier * 100) + '%', pct: stats.areaStat.totalMultiplier / 3 },
            { label: 'Espinhos', value: stats.thorns.toFixed(0), pct: stats.thorns / 100 }
        ];

        visibleStats.forEach(stat => {
            const entry = document.createElement('div');
            entry.className = 'stat-entry';

            const info = document.createElement('div');
            info.className = 'stat-info';
            info.innerHTML = `<span>${stat.label}</span><span class="stat-value">${stat.value}</span>`;

            const bar = document.createElement('div');
            bar.className = 'stat-bar';

            const fill = document.createElement('div');
            fill.className = 'stat-fill';
            fill.style.width = `${Math.min(100, Math.max(0, stat.pct * 100))}%`;

            bar.appendChild(fill);
            entry.append(info, bar);
            this.statsList.appendChild(entry);
        });
    }

    getTypeLabel(upgrade) {
        if (upgrade.isEvolution) return 'EVOLUÇÃO';
        if (upgrade.type === 'new_weapon') return 'NOVA ARMA';
        if (upgrade.type === 'levelup_weapon') return 'MELHORIA';
        if (upgrade.type === 'new_item') return 'EQUIPAMENTO';
        if (upgrade.type === 'levelup_item') return 'UPGRADE';
        return 'PASSIVO';
    }

    hide() {
        if (this.screen) {
            this.screen.classList.remove('active');
        }

        if (this.scene.bootstrap && this.scene.bootstrap.uiFlow) {
            this.scene.bootstrap.uiFlow.closeScreen('upgrade');
        } else {
            this.scene.scene.resume();
        }
    }
}
