import { Weapon } from '../entities/weapon/weapon.js';

export class WeaponManager {
    constructor(scene) {
        this.scene = scene;
        this.player = scene.player;
        this.playerCombat = scene.playerCombat;
        this.enemySpawner = scene.enemySpawner;

        this.weapons = []; // Array of active Weapon instances
    }

    /**
     * Called when EquipmentManager equips a new weapon
     */
    /**
     * Called when EquipmentManager equips a new weapon
     * slot info may be provided by some callers
     */
    onWeaponEquipped(weaponKey, slot = null) {
        // Prevent duplicates
        if (this.weapons.some(w => w.weaponKey === weaponKey)) {
            return;
        }

        // Enforce max 2 weapons locally as well
        if (this.weapons.length >= 2) {
            console.debug(`[WeaponManager] Rejecting weapon ${weaponKey} - local limit reached`);
            return;
        }

        const weaponData = new Weapon(
            this.scene,
            this.playerCombat,
            this.enemySpawner,
            weaponKey
        );

        const weaponSprite = this.createWeaponSprite(weaponData);

        this.weapons.push({
            weaponKey: weaponKey,
            weaponData: weaponData,
            sprite: weaponSprite,
            slot: slot || (this.weapons.length === 0 ? 'primary' : 'secondary')
        });

        // Set the first weapon as the primary weapon reference for the player if needed
        if (this.weapons.length === 1) {
            this.scene.player.weapon = weaponData;
        }
    }

    /**
     * Create visual sprite representation for a weapon
     */
    createWeaponSprite(weapon) {
        const playerX = this.player.x;
        const playerY = this.player.y;
        const facingRight = this.player.facingRight ? 1 : -1;
        const offset = weapon.config.visual.offset;

        const sprite = this.scene.add.sprite(
            playerX + offset.x * facingRight,
            playerY + offset.y,
            weapon.config.key
        );
        sprite.setScale(weapon.config.visual.scale || 0.6);
        sprite.setDepth(playerY + offset.y);
        sprite.setAngle(weapon.config.visual.angleOrigin);
        sprite.setFlipX(facingRight === -1);
        sprite.setData('weaponKey', weapon.config.key);

        return sprite;
    }

    /**
     * Main update loop - updates all weapons and their positions
     */
    update(delta) {
        if (!this.player || !this.player.active) return;

        const facingRight = this.player.facingRight ? 1 : -1;
        const playerX = this.player.x;
        const playerY = this.player.y;

        this.weapons.forEach((data) => {
            if (data && data.weaponData && data.weaponData.update) {
                data.weaponData.update(delta);
                data.sprite.setPosition(playerX + data.weaponData.config.visual.offset.x * facingRight, playerY + data.weaponData.config.visual.offset.y);
                data.sprite.setFlipX(facingRight === -1);
                data.sprite.setScale(data.weaponData.config.visual.scale);
                data.sprite.setDepth(playerY + data.weaponData.config.visual.offset.y);
            }
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
        return this.weapons.find(w => w.weaponKey === weaponKey)?.weaponData;
    }

    /**
     * Clean up all weapons and sprites
     */
    destroy() {
        this.weapons.forEach(w => {
            if (w.sprite) {
                w.sprite.destroy();
            }
            if (w.weaponData && w.weaponData.destroy) {
                w.weaponData.destroy();
            }
        });
        this.weapons = [];
    }
}