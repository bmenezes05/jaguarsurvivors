export class PauseUIManager {
    constructor(scene) {
        this.scene = scene;
        this.screen = document.getElementById('pause-screen');

        // Element cache
        this.charImg = document.getElementById('pause-char-img');
        this.charName = document.getElementById('pause-char-name');
        this.statsList = document.getElementById('pause-stats-list');
        this.weaponsGrid = document.getElementById('pause-weapons-grid');
        this.itemsGrid = document.getElementById('pause-items-grid');
    }

    show() {
        if (!this.screen) return;

        this.screen.classList.add('active');
        this.updateCharacterPreview();
        this.updateStatsPanel();
        this.updateLoadout();
    }

    updateCharacterPreview() {
        if (!this.scene.player || !this.scene.playerConfig) return;

        const config = this.scene.playerConfig;
        if (this.charImg) this.charImg.src = config.player_body_image || '';
        if (this.charName) this.charName.innerText = config.name || 'JAGUAR';
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

    updateLoadout() {
        if (!this.weaponsGrid || !this.itemsGrid || !this.scene.equipmentManager) return;

        const equipment = this.scene.equipmentManager;

        // Weapons
        this.weaponsGrid.innerHTML = '';
        const maxWeapons = 3;
        // In some managers it's an array of strings, ensure we handle it
        const weapons = Array.isArray(equipment.equippedWeapons) ? equipment.equippedWeapons : [];

        for (let i = 0; i < maxWeapons; i++) {
            const slot = document.createElement('div');
            slot.className = 'pause-slot' + (weapons[i] ? '' : ' empty');

            if (weapons[i]) {
                const img = document.createElement('img');
                img.src = `src/assets/images/${weapons[i]}.png`;
                slot.appendChild(img);

                // Try to get level
                const levelDisplay = document.createElement('div');
                levelDisplay.className = 'level-badge';
                const weaponMap = this.scene.weaponManager?.weapons;
                // Check if it's a Map (new structure) or Array (old structure)
                let weaponLevel = '1';

                if (weaponMap instanceof Map) {
                    const w = weaponMap.get(weapons[i]);
                    if (w) weaponLevel = w.level;
                } else if (Array.isArray(weaponMap)) {
                    const w = weaponMap.find(x => x.weaponKey === weapons[i]);
                    if (w && w.weaponData) weaponLevel = w.weaponData.level;
                }

                levelDisplay.innerText = weaponLevel;
                slot.appendChild(levelDisplay);
            } else {
                slot.innerText = '?';
            }
            this.weaponsGrid.appendChild(slot);
        }

        // Items
        this.itemsGrid.innerHTML = '';
        const maxItems = 3;
        const items = Array.from(equipment.equippedItems.entries()) || [];

        for (let i = 0; i < maxItems; i++) {
            const slot = document.createElement('div');
            slot.className = 'pause-slot' + (items[i] ? '' : ' empty');

            if (items[i]) {
                const [itemId, level] = items[i];
                const itemConfig = equipment.allPossibleItems.find(it => it.id === itemId);

                const img = document.createElement('img');
                img.src = `src/assets/images/${itemConfig?.spriteKey || 'pickup_bomb'}.png`;
                slot.appendChild(img);

                const levelDisplay = document.createElement('div');
                levelDisplay.className = 'level-badge';
                levelDisplay.innerText = level;
                slot.appendChild(levelDisplay);
            } else {
                slot.innerText = '?';
            }
            this.itemsGrid.appendChild(slot);
        }
    }

    hide() {
        if (this.screen) {
            this.screen.classList.remove('active');
        }
    }
}
