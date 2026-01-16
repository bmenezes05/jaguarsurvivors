import { CONFIG } from '../config/config.js';

export class LoadoutUIManager {
    constructor(scene) {
        this.scene = scene;

        this.weaponSlots = [];
        this.itemSlots = [];
        this.legendarySlots = [];

        this.root = document.getElementById('game-ui');
        if (!this.root) {
            console.warn('[LoadoutUI] #game-ui not found');
            return;
        }

        this.createUI();
        this.setupEventListeners();
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

        // ========== LEGENDARIES ==========
        const legendarySection = document.createElement('div');
        legendarySection.className = 'loadout-section';

        const legendaryTitle = document.createElement('div');
        legendaryTitle.className = 'loadout-title legendary';
        legendaryTitle.innerText = 'PODERES';

        this.legendarySlotsContainer = document.createElement('div');
        this.legendarySlotsContainer.className = 'loadout-slots';
        this.legendarySlotsContainer.id = 'legendary-slots';

        const maxLegendaries = CONFIG.equipmentLimits?.maxLegendaries || 4;
        for (let i = 0; i < maxLegendaries; i++) {
            const slot = this.createLegendaryPlaceholderSlot();
            this.legendarySlots.push(slot);
            this.legendarySlotsContainer.appendChild(slot.el);
        }

        legendarySection.appendChild(legendaryTitle);
        legendarySection.appendChild(this.legendarySlotsContainer);

        // Append everything
        this.container.appendChild(weaponsSection);
        this.container.appendChild(itemsSection);
        this.container.appendChild(legendarySection);

        this.root.appendChild(this.container);
    }

    setupEventListeners() {
        // Listen for legendary obtained events
        if (this.scene?.events) {
            this.scene.events.on('legendary-obtained', (config) => {
                this.onLegendaryObtained(config);
            });
        }
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

    createLegendaryPlaceholderSlot() {
        const el = document.createElement('div');
        el.className = 'loadout-slot legendary';

        const img = document.createElement('img');
        img.style.display = 'none';
        img.alt = '';

        const tooltip = document.createElement('div');
        tooltip.className = 'legendary-tooltip';
        tooltip.style.display = 'none';

        el.appendChild(img);
        el.appendChild(tooltip);

        return {
            el,
            img,
            tooltip,
            type: 'legendary',
            isEmpty: true,
            legendaryId: null
        };
    }

    onWeaponEquipped(key, slot = null) {
        let slotToFill;

        if (slot === 'primary') {
            slotToFill = this.weaponSlots[0];
        } else if (slot === 'secondary') {
            slotToFill = this.weaponSlots[1];
        } else {
            slotToFill = this.weaponSlots.find(s => s.isEmpty);
        }

        if (!slotToFill) return;

        slotToFill.img.src = `src/assets/images/${key}.png`;
        slotToFill.img.style.display = 'block';
        slotToFill.level.innerText = '1';
        slotToFill.isEmpty = false;
        slotToFill.weaponKey = key;
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

    onLegendaryObtained(config) {
        const emptySlot = this.legendarySlots.find(s => s.isEmpty);
        if (!emptySlot) {
            console.warn('[LoadoutUI] No more legendary slots available');
            return;
        }

        // Fill the slot with the legendary
        emptySlot.img.src = `src/assets/images/${config.sprite || config.id}.png`;
        emptySlot.img.style.display = 'block';
        emptySlot.img.alt = config.name;

        // Update tooltip
        emptySlot.tooltip.innerHTML = `
            <h4>${config.name}</h4>
            <p>${config.description}</p>
        `;
        emptySlot.tooltip.style.display = '';

        // Mark as filled
        emptySlot.isEmpty = false;
        emptySlot.legendaryId = config.id;

        // Add entrance animation
        emptySlot.el.style.animation = 'legendarySlotEntrance 0.4s ease-out';
    }

    destroy() {
        // Remove event listeners
        if (this.scene?.events) {
            this.scene.events.off('legendary-obtained');
        }

        this.container?.remove();
    }
}

