import { CONFIG } from '../config.js';

export class LoadoutUIManager {
    constructor(scene) {
        this.scene = scene;

        this.weaponSlots = [];
        this.itemSlots = [];

        this.root = document.getElementById('game-ui');
        if (!this.root) {
            console.warn('[LoadoutUI] #game-ui not found');
            return;
        }

        this.createUI();
    }

    createUI() {
        // Main container
        this.container = document.createElement('div');
        this.container.id = 'loadout-ui';

        // ========== WEAPONS ==========
        const weaponsSection = document.createElement('div');
        weaponsSection.className = 'loadout-section';

        const weaponsTitle = document.createElement('div');
        weaponsTitle.className = 'loadout-title weapon';
        weaponsTitle.innerText = 'WEAPONS';

        const weaponsSlots = document.createElement('div');
        weaponsSlots.className = 'loadout-slots';

        const maxWeapons = CONFIG.equipmentLimits?.maxWeapons || 3;
        for (let i = 0; i < maxWeapons; i++) {
            const slot = this.createSlot('weapon');
            this.weaponSlots.push(slot);
            weaponsSlots.appendChild(slot.el);
        }

        weaponsSection.appendChild(weaponsTitle);
        weaponsSection.appendChild(weaponsSlots);

        // ========== ITEMS ==========
        const itemsSection = document.createElement('div');
        itemsSection.className = 'loadout-section';

        const itemsTitle = document.createElement('div');
        itemsTitle.className = 'loadout-title item';
        itemsTitle.innerText = 'ITEMS';

        const itemsSlots = document.createElement('div');
        itemsSlots.className = 'loadout-slots';

        const maxItems = CONFIG.equipmentLimits?.maxItems || 3;
        for (let i = 0; i < maxItems; i++) {
            const slot = this.createSlot('item');
            this.itemSlots.push(slot);
            itemsSlots.appendChild(slot.el);
        }

        itemsSection.appendChild(itemsTitle);
        itemsSection.appendChild(itemsSlots);

        // Append everything
        this.container.appendChild(weaponsSection);
        this.container.appendChild(itemsSection);

        this.root.appendChild(this.container);
    }

    createSlot(type) {
        const el = document.createElement('div');
        el.className = `loadout-slot ${type}`;

        const img = document.createElement('img');
        img.src = 'src/assets/images/pickup_bomb.png';
        img.style.display = 'none';

        const level = document.createElement('div');
        level.className = 'slot-level';

        el.appendChild(img);
        el.appendChild(level);

        return {
            el,
            img,
            level,
            type,
            isEmpty: true
        };
    }

    onWeaponEquipped(key) {
        const slot = this.weaponSlots.find(s => s.isEmpty);
        if (!slot) return;

        slot.img.src = `src/assets/images/${key}.png`;
        slot.img.style.display = 'block';
        slot.level.innerText = '1';
        slot.isEmpty = false;
        slot.weaponKey = key;
    }

    onWeaponLeveled(key, level) {
        const slot = this.weaponSlots.find(s => s.weaponKey === key);
        if (slot) slot.level.innerText = level;
    }

    onItemEquipped(id) {
        const slot = this.itemSlots.find(s => s.isEmpty);
        if (!slot) return;

        const item = CONFIG.equipableItems.find(i => i.id === id);
        slot.img.src = `src/assets/images/${item?.spriteKey || 'pickup_bomb'}.png`;
        slot.img.style.display = 'block';
        slot.level.innerText = '1';
        slot.isEmpty = false;
        slot.itemId = id;
    }

    onItemLeveled(id, level) {
        const slot = this.itemSlots.find(s => s.itemId === id);
        if (slot) slot.level.innerText = level;
    }

    destroy() {
        this.container?.remove();
    }
}
