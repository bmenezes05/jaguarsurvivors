import { CONFIG } from '../../config/config.js';
import { Stat } from '../../systems/statSystem.js';
import { SaveManager } from '../../managers/saveManager.js';

export class PlayerStats {
    constructor(config) {
        const s = config.stats || {};

        this.moveSpeedStat = new Stat(config.speed);
        this.maxHealthStat = new Stat(config.health);
        this.evasionStat = new Stat(0);
        this.thornsStat = new Stat(0);
        this.hpRegenStat = new Stat(0);
        this.pickupRadiusStat = new Stat(0);
        this.damageStat = new Stat(0);
        this.attackSpeedStat = new Stat(0);
        this.areaStat = new Stat(0);
        this.projectileSpeedStat = new Stat(0);
        this.elementalDamageStat = new Stat(0);
        this.knockbackStat = new Stat(0);
        this.critChanceStat = new Stat(0);
        this.criticalDamageStat = new Stat(0);
        this.lifeStealStat = new Stat(0);
        this.dashCooldownStat = new Stat(1000);
        this.dashSpeedStat = new Stat(1000);

        if (s.moveSpeed) this.moveSpeedStat.totalMultiplier = s.moveSpeed;
        if (s.maxHealth) this.maxHealthStat.totalMultiplier = s.maxHealth;
        if (s.evasion) this.evasionStat.addFlat(s.evasion);
        if (s.thorns) this.thornsStat.addFlat(s.thorns);
        if (s.hpRegen) this.hpRegenStat.addFlat(s.hpRegen);
        if (s.pickupRadius) this.pickupRadiusStat.addFlat(s.pickupRadius);
        if (s.damage) this.damageStat.addFlat(s.damage);
        if (s.attackSpeed) this.attackSpeedStat.addFlat(s.attackSpeed);
        if (s.area) this.areaStat.addFlat(s.area);
        if (s.projectileSpeed) this.projectileSpeedStat.addFlat(s.projectileSpeed);
        if (s.elementalDamage) this.elementalDamageStat.addFlat(s.elementalDamage);
        if (s.knockback) this.knockbackStat.addFlat(s.knockback);
        if (s.critChance) this.critChanceStat.addFlat(s.critChance);
        if (s.criticalDamage) this.criticalDamageStat.addFlat(s.criticalDamage);
        if (s.lifeSteal) this.lifeStealStat.addFlat(s.lifeSteal);
        if (config.dash && config.dash.cooldown) this.dashCooldownStat.totalMultiplier = config.dash.cooldown / 1000;
        if (s.dashSpeed) this.dashSpeedStat.totalMultiplier = s.dashSpeed;

        this._applyMetaUpgrades();
    }

    _applyMetaUpgrades() {
        const meta = SaveManager.getInstance().data.metaUpgrades;
        CONFIG.metaShop.forEach(upgrade => {
            const rank = meta[upgrade.id] || 0;
            if (rank > 0 && this[upgrade.stat + 'Stat']) {
                this[upgrade.stat + 'Stat'].addMultiplier(rank * upgrade.bonusPerRank);
            }
        });
    }

    get moveSpeed() { return this.moveSpeedStat.getValue(); }
    get maxHealth() { return this.maxHealthStat.getValue(); }
    get evasion() { return this.evasionStat.getValue(); }
    get thorns() { return this.thornsStat.getValue(); }
    get hpRegen() { return this.hpRegenStat.getValue(); }
    get pickupRadius() { return this.pickupRadiusStat.getValue(); }
    get damage() { return this.damageStat.getValue(); }
    get attackSpeed() { return this.attackSpeedStat.getValue(); }
    get area() { return this.areaStat.getValue(); }
    get projectileSpeed() { return this.projectileSpeedStat.getValue(); }
    get elementalDamage() { return this.elementalDamageStat.getValue(); }
    get knockback() { return this.knockbackStat.getValue(); }
    get critChance() { return this.critChanceStat.getValue(); }
    get criticalDamage() { return this.criticalDamageStat.getValue(); }
    get lifeSteal() { return this.lifeStealStat.getValue(); }
    get dashCooldown() { return this.dashCooldownStat.getValue(); }
    get dashSpeed() { return this.dashSpeedStat.getValue(); }
}
