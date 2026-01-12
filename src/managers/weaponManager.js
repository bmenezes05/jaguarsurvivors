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
        let sprite;

        switch (weapon.config.strategyStats.behaviorType) {
            case 'THRUST':
                sprite = this.scene.add.sprite(
                    playerX + offset.x * facingRight,
                    playerY + offset.y,
                    weapon.config.key
                );
                sprite.setFlipY(facingRight === -1);
                break;
            default:
                sprite = this.scene.add.sprite(
                    playerX + offset.x * facingRight,
                    playerY + offset.y,
                    weapon.config.key
                );
                sprite.setFlipX(facingRight === -1);
                break;
        }

        const visual = weapon.config.visual || {};
        sprite.setScale(visual.scale || 0.6);
        if (visual.origin) {
            sprite.setOrigin(visual.origin.x, visual.origin.y);
        }
        sprite.setDepth(playerY + offset.y);
        sprite.setAngle(visual.angleOrigin);


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
                switch (data.weaponData.strategyStats.behaviorType) {
                    case 'THRUST':
                        data.sprite.setFlipY(facingRight === -1);
                        break;
                    default:
                        data.sprite.setFlipX(facingRight === -1);
                        break;
                }
                const visual = data.weaponData.config.visual || {};
                const animX = data.weaponData.animOffset?.x || 0;
                const animY = data.weaponData.animOffset?.y || 0;

                data.sprite.setPosition(
                    playerX + (visual.offset.x + animX) * facingRight,
                    playerY + visual.offset.y + animY
                );

                // Ensure origin is correct (strategies might have changed it)
                // We only reset if both offset is zero AND no tweens are active on the sprite
                const isTweening = this.scene.tweens.isTweening(data.sprite);
                if (data.weaponData.animOffset.x === 0 && data.weaponData.animOffset.y === 0 && !isTweening) {
                    if (visual.origin) {
                        const isThrust = data.weaponData.strategyStats.behaviorType === 'THRUST';
                        const isFlipped = facingRight === -1;

                        let ox = visual.origin.x;
                        let oy = visual.origin.y;

                        if (isFlipped) {
                            if (isThrust) {
                                oy = 1 - oy; // Mirror Y for flipY
                            } else {
                                ox = 1 - ox; // Mirror X for flipX
                            }
                        }
                        data.sprite.setOrigin(ox, oy);
                    }
                }

                data.sprite.setScale(visual.scale);
                data.sprite.setDepth(visual.depth || playerY + visual.offset.y);
            }
        });
    }

    /**
     * Called when a weapon levels up
     */
    onWeaponLeveled(weaponKey, newLevel) {
        // Stats already applied in upgradeManager, no visual changes needed yet
        const weaponInfo = this.weapons.find(w => w.weaponKey === weaponKey);
        if (weaponInfo && weaponInfo.weaponData) {
            weaponInfo.weaponData.level = newLevel;
        }
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