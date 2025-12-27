import { CONFIG } from '../config.js';
import { Weapon } from '../entities/weapon/weapon.js';

export class WeaponManager {
    constructor(scene) {
        this.scene = scene;
        this.player = scene.player;
        this.playerCombat = scene.playerCombat;
        this.enemySpawner = scene.enemySpawner;

        this.weapons = []; // Array of active Weapon instances
        this.weaponSprites = []; // Visual sprite containers
    }

    /**
     * Called when EquipmentManager equips a new weapon
     */
    onWeaponEquipped(weaponKey) {
        // Create weapon logic instance
        const weapon = new Weapon(
            this.scene,
            this.playerCombat,
            this.enemySpawner,
            weaponKey
        );

        this.weapons.push(weapon);

        // Create visual sprite for weapon
        const weaponSprite = this.createWeaponSprite(weaponKey, this.weapons.length - 1);
        this.weaponSprites.push(weaponSprite);

        // Backward compatibility: first weapon is player.weapon
        if (this.weapons.length === 1) {
            this.scene.player.weapon = weapon;
        }
    }

    /**
     * Create visual sprite representation for a weapon
     */
    createWeaponSprite(weaponKey, index) {
        const config = CONFIG.weapon.find(w => w.key === weaponKey);
        if (!config) {
            console.warn(`[WeaponManager] Weapon config not found: ${weaponKey}`);
            return null;
        }

        const sprite = this.scene.add.sprite(0, 0, weaponKey);
        sprite.setScale(config.scale || 0.6);
        sprite.setDepth(this.player.y - 1); // Behind player initially

        // Store metadata
        sprite.setData('weaponIndex', index);
        sprite.setData('weaponKey', weaponKey);

        return sprite;
    }

    /**
     * Main update loop - updates all weapons and their positions
     */
    update(delta) {
        if (!this.player || !this.player.active) return;

        // Update all weapon logic (targeting, cooldowns, attacks)
        this.weapons.forEach(weapon => {
            if (weapon && weapon.update) {
                weapon.update(delta);
            }
        });

        // Update visual positions (orbital around player)
        this.updateWeaponPositions();
    }

    /**
     * Position weapons in orbit formation around player
     */
    updateWeaponPositions() {
        const facingRight = this.player.facingRight ? 1 : -1;
        const playerX = this.player.x;
        const playerY = this.player.y;
        const count = this.weaponSprites.length;

        if (count === 0) return;

        const radius = this.player.config.bodyWidth * facingRight;

        this.weaponSprites.forEach((sprite, index) => {
            if (!sprite) return;

            // Orbital positioning: evenly distribute around circle
            const angle = (index / count) * Math.PI * 2;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;

            sprite.setPosition(playerX + offsetX, playerY + offsetY);

            // Correct depth sorting (weapons below player use player.y, above use player.y + offset)
            sprite.setDepth(playerY + offsetY);
        });
    }

    /**
     * Called when a weapon levels up
     */
    onWeaponLeveled(weaponKey, newLevel) {
        // Stats already applied in upgradeManager, no visual changes needed yet
    }

    /**
     * Get weapon instance by key
     */
    getWeapon(weaponKey) {
        const index = this.scene.equipmentManager.equippedWeapons.indexOf(weaponKey);
        return this.weapons[index];
    }

    /**
     * Clean up all weapons and sprites
     */
    destroy() {
        this.weapons.forEach(w => {
            if (w.destroy) w.destroy();
        });
        this.weaponSprites.forEach(s => {
            if (s && s.destroy) s.destroy();
        });
        this.weapons = [];
        this.weaponSprites = [];
    }
}
