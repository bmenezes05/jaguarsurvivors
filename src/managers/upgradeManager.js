import { CONFIG } from '../config/config.js';

/**
 * UpgradeManager - Fully data-driven upgrade system
 * Loads all upgrades from CONFIG and implements roguelike selection logic
 */
export class UpgradeManager {
    constructor(scene) {
        this.scene = scene;
        this.upgradeCounts = {}; // Track how many times each upgrade was taken
        this.acquiredEvolutions = new Set(); // Track acquired synergy/evolution upgrades
    }

    /**
     * Get 3 smart upgrade options following roguelike patterns
     * Implements:
     * - New weapons (if < 6)
     * - Level up weapons
     * - New items (if < 6)
     * - Level up items
     * - Passive upgrades
     * - Synergies (when requirements met)
     */
    getSmartUpgradeOptions(count = 3) {
        const options = [];
        const equipment = this.scene.equipmentManager;
        const weaponSlotsFull = !equipment.canAddWeapon();

        // Build option pools
        const newWeaponOptions = this.getNewWeaponOptions(equipment);
        const weaponLevelUpOptions = this.getWeaponLevelUpOptions(equipment);
        const newItemOptions = this.getNewItemOptions(equipment);
        const itemLevelUpOptions = this.getItemLevelUpOptions(equipment);

        // Build weighted pool following the strict slot-based rules
        let weightedPool = [];

        if (weaponSlotsFull) {
            // Rule: No new weapons allowed, only level upgrades for equipped ones
            weightedPool = [
                ...weaponLevelUpOptions,
                ...weaponLevelUpOptions, // High weight for weapon progression
                ...itemLevelUpOptions,
                ...itemLevelUpOptions,
                ...newItemOptions
            ];
            // Note: newWeaponOptions is NOT added here
        } else {
            // Normal progression: can suggest new weapons
            weightedPool = [
                ...weaponLevelUpOptions,
                ...weaponLevelUpOptions,
                ...itemLevelUpOptions,
                ...itemLevelUpOptions,
                ...newWeaponOptions,
                ...newItemOptions
            ];
        }

        // Shuffle and select unique options
        const shuffled = weightedPool.sort(() => Math.random() - 0.5);
        const usedIds = new Set();

        for (const option of shuffled) {
            if (options.length >= count) break;
            if (usedIds.has(option.id)) continue;

            options.push(option);
            usedIds.add(option.id);
        }

        return options.slice(0, count);
    }

    // ==================== OPTION BUILDERS ====================

    getNewWeaponOptions(equipment) {
        // Filter based on both ownership AND slot availability
        const unowned = CONFIG.weapon.filter(w => !equipment.hasWeapon(w.key));
        const available = unowned.filter(w => equipment.canAddWeapon(w.slotType || 'primary'));

        return available.map(w => ({
            type: 'new_weapon',
            id: w.key,
            name: `${w.name}`,
            spriteKey: w.key, // Weapon sprites use their key
            icon: '🗡️',
            desc: `Adquirir nova arma: ${w.name}`,
            apply: () => {
                equipment.addWeapon(w.key);
                // Weapon will be activated by combat system
            }
        }));
    }

    getWeaponLevelUpOptions(equipment) {
        return equipment.equippedWeapons.map(key => {
            const weapon = CONFIG.weapon.find(w => w.key === key);
            const currentLevel = equipment.getWeaponLevel(key);

            return {
                type: 'levelup_weapon',
                id: `${key}_levelup`,
                name: `${weapon.name} Nv.${currentLevel + 1}`,
                spriteKey: weapon.key,
                icon: '⬆️',
                desc: `+10% Dano, +5% Vel. Ataque`,
                apply: () => {
                    equipment.levelUpWeapon(key);
                    // Apply stat bonuses for weapon level up
                    this.scene.player.stats.damageStat.addMultiplier(0.1);
                    this.scene.player.stats.attackSpeedStat.addMultiplier(0.05);
                }
            };
        });
    }

    getNewItemOptions(equipment) {
        if (!equipment.canAddItem()) return [];

        const unowned = CONFIG.equipableItems.filter(item => !equipment.hasItem(item.id));

        return unowned.map(item => ({
            type: 'new_item',
            id: item.id,
            name: item.name,
            spriteKey: item.spriteKey || 'pickup_bomb',
            icon: item.icon,
            desc: item.desc,
            apply: () => {
                equipment.addItem(item.id);
                // Apply level 1 effects
                item.levelEffects.forEach(effect => {
                    this.scene.player.stats[effect.stat][effect.operation](effect.value);
                });
            }
        }));
    }

    getItemLevelUpOptions(equipment) {
        return equipment.equippedItems
            .map(equipItem => {
                const itemConfig = CONFIG.equipableItems.find(i => i.id === equipItem.id);
                if (!itemConfig) return null;
                if (equipItem.level >= itemConfig.maxLevel) return null; // Max level reached

                return {
                    type: 'levelup_item',
                    id: `${equipItem.id}_levelup`,
                    name: `${itemConfig.name} Nv.${equipItem.level + 1}`,
                    spriteKey: itemConfig.spriteKey || 'pickup_bomb',
                    icon: '⬆️',
                    desc: itemConfig.desc,
                    apply: () => {
                        equipment.levelUpItem(equipItem.id);
                        // Apply level effects
                        itemConfig.levelEffects.forEach(effect => {
                            this.scene.player.stats[effect.stat][effect.operation](effect.value);
                        });
                    }
                };
            })
            .filter(Boolean); // Remove nulls
    }


    // ==================== APPLY METHODS ====================

    /**
     * Legacy compatibility: apply upgrade by ID
     * Used by UI when player selects an upgrade
     */
    applyUpgrade(upgradeOption) {
        if (upgradeOption.apply) {
            upgradeOption.apply();
        }
    }

    /**
     * Legacy method for backward compatibility
     * Returns simple passive upgrades (used by old UI if still needed)
     */
    getRandomUpgrades(count = 3) {
        console.warn('[UpgradeManager] getRandomUpgrades() is deprecated. Use getSmartUpgradeOptions() instead.');
        return this.getSmartUpgradeOptions(count);
    }
}