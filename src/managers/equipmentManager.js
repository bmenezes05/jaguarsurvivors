import { CONFIG } from '../config/config.js';

/**
 * EquipmentManager
 * Tracks player's equipped weapons and items with configurable limits
 * Implements roguelike equipment progression system
 */
export class EquipmentManager {
    constructor(scene) {
        this.scene = scene;

        // Equipment limits from config (beta: 3/3)
        this.maxWeapons = CONFIG.equipmentLimits?.maxWeapons || 6;
        this.maxItems = CONFIG.equipmentLimits?.maxItems || 6;

        // Tracking arrays
        this.equippedWeapons = []; // Array of weapon config keys ['weapon_sword', 'weapon_katana', ...]
        this.equippedItems = []; // Array of { id, level } objects
        this.weaponLevels = {}; // { weaponKey: level }
    }

    /**
     * Initialize with starting weapon from character config
     */
    init(startingWeaponKey) {
        if (startingWeaponKey) {
            this.addWeapon(startingWeaponKey);
        }
    }

    // =============== CHECK METHODS ===============

    canAddWeapon() {
        return this.equippedWeapons.length < this.maxWeapons;
    }

    canAddItem() {
        return this.equippedItems.length < this.maxItems;
    }

    hasWeapon(key) {
        return this.equippedWeapons.includes(key);
    }

    hasItem(id) {
        return this.equippedItems.some(item => item.id === id);
    }

    getWeaponLevel(key) {
        return this.weaponLevels[key] || 0;
    }

    getItemLevel(id) {
        const item = this.equippedItems.find(i => i.id === id);
        return item?.level || 0;
    }

    // =============== ADD METHODS ===============
    addWeapon(key) {
        if (!this.canAddWeapon()) {
            console.warn(`[EquipmentManager] Cannot add weapon ${key} - at max limit (${this.maxWeapons})`);
            return false;
        }

        if (this.hasWeapon(key)) {
            console.warn(`[EquipmentManager] Weapon ${key} already equipped`);
            return false;
        }

        this.equippedWeapons.push(key);
        this.weaponLevels[key] = 1;

        console.debug("EVENT_EMITTED", { eventName: 'weapon-equipped', payload: key });
        this.scene.events.emit('weapon-equipped', key);

        return true;
    }

    addItem(id) {
        if (!this.canAddItem()) {
            console.warn(`[EquipmentManager] Cannot add item ${id} - at max limit (${this.maxItems})`);
            return false;
        }

        if (this.hasItem(id)) {
            console.warn(`[EquipmentManager] Item ${id} already equipped`);
            return false;
        }

        this.equippedItems.push({ id, level: 1 });

        console.debug("EVENT_EMITTED", { eventName: 'item-equipped', payload: id });
        this.scene.events.emit('item-equipped', id);

        return true;
    }

    // =============== LEVEL UP METHODS ===============

    levelUpWeapon(key) {
        if (!this.hasWeapon(key)) {
            console.warn(`[EquipmentManager] Cannot level up weapon ${key} - not equipped`);
            return false;
        }

        this.weaponLevels[key]++;

        console.debug("EVENT_EMITTED", { eventName: 'weapon-leveled', payload: { key, level: this.weaponLevels[key] } });
        this.scene.events.emit('weapon-leveled', key, this.weaponLevels[key]);

        return true;
    }

    levelUpItem(id) {
        const item = this.equippedItems.find(i => i.id === id);

        if (!item) {
            console.warn(`[EquipmentManager] Cannot level up item ${id} - not equipped`);
            return false;
        }

        item.level++;

        console.debug("EVENT_EMITTED", { eventName: 'item-leveled', payload: { id, level: item.level } });
        this.scene.events.emit('item-leveled', id, item.level);

        return true;
    }

    // =============== UTILITY METHODS ===============

    /**
     * Get summary of current equipment
     */
    getSummary() {
        return {
            weapons: this.equippedWeapons.length,
            maxWeapons: this.maxWeapons,
            items: this.equippedItems.length,
            maxItems: this.maxItems,
            weaponSlotsFull: !this.canAddWeapon(),
            itemSlotsFull: !this.canAddItem()
        };
    }

    /**
     * Reset all equipment (for new game)
     */
    reset() {
        this.equippedWeapons = [];
        this.equippedItems = [];
        this.weaponLevels = {};
    }
}
