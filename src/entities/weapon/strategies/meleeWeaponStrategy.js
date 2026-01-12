import { WeaponStrategy } from '../weaponStrategy.js';

export class MeleeWeaponStrategy extends WeaponStrategy {
    constructor(weapon) {
        super(weapon);
    }

    attack() {
        const { config } = this.weapon;
        console.debug("EVENT_EMITTED", { eventName: 'weapon-attack', payload: config.key });
        this.scene.events.emit('weapon-attack', config.key);

        this.playAnimation();
        this.spawnHitbox();
    }


    playAnimation() {
        const { config, player } = this.weapon;
        const sprite = this.getWeaponSprite();
        if (!sprite) {
            console.warn('[MeleeWeaponStrategy] No weapon sprite found');
            return;
        }

        const visual = config.visual || {};
        const strategyStats = config.strategyStats || {};
        const behaviorType = strategyStats.behaviorType || 'FRONT_SWING';

        const atkSpeed = player.stats.attackSpeed;
        const duration = (strategyStats.meleeAnimDuration ?? 250) / atkSpeed;

        const baseScale = visual.scale ?? 0.6;
        const scale = baseScale * player.stats.area;

        const facing = player.facingRight ? 1 : -1;

        // Behavior-specific animations
        if (behaviorType === 'THRUST') {
            this.playThrustAnimation(sprite, player, facing, duration, visual);
        } else {
            // Default: Arc swing motion
            this.playSwingAnimation(sprite, player, facing, duration, visual);
        }
    }

    playSwingAnimation(sprite, player, facing, duration, visual) {
        // Apply grip origin for rotating around the handle/center
        const isFlipped = facing === -1;
        let gx = visual.gripOrigin?.x ?? 0.5;
        let gy = visual.gripOrigin?.y ?? 1.5;

        if (isFlipped) {
            gx = 1 - gx; // Mirror X for flipX
        }
        sprite.setOrigin(gx, gy);

        this.scene.tweens.add({
            targets: sprite,
            angle: (visual.angleAttack ?? 180) * facing,
            duration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                // Revert to default origin (mirrored if needed)
                if (visual.origin) {
                    let ox = visual.origin.x;
                    let oy = visual.origin.y;
                    if (isFlipped) ox = 1 - ox;
                    sprite.setOrigin(ox, oy);
                } else {
                    sprite.setOrigin(0.5, 0.5);
                }
                sprite.setAngle(visual.angleOrigin ?? 0);
            }
        });
    }

    playThrustAnimation(sprite, player, facing, duration, visual) {
        // We do NOT change origin or angle here anymore to avoid jumping,
        // The WeaponManager handles the base origin (including mirroring).
        // However, we must ensure any previous transient origin is cleared.
        const isFlipped = facing === -1;

        // Thrust forward (relatively)
        const thrustDistance = 60;

        // Important: We target the weapon's animOffset property
        this.scene.tweens.add({
            targets: this.weapon.animOffset,
            x: thrustDistance,
            duration: duration * 0.4,
            ease: 'Quad.easeOut',
            onComplete: () => {
                // Retract
                this.scene.tweens.add({
                    targets: this.weapon.animOffset,
                    x: 0,
                    duration: duration * 0.6,
                    ease: 'Quad.easeIn'
                });
            }
        });
    }


    spawnHitbox() {
        const { weapon } = this;
        const { config, player, enemySpawner } = weapon;
        const strategyStats = config.strategyStats || {};

        // Get behavior type (default to FRONT_SWING for backward compatibility)
        const behaviorType = strategyStats.behaviorType || 'FRONT_SWING';

        const area = player.stats.area;
        const atkSpeed = player.stats.attackSpeed;
        const duration = (strategyStats.meleeAnimDuration ?? 250) / atkSpeed;

        const hitTargets = new Set();

        // Create behavior-specific hitbox
        let hitbox;
        switch (behaviorType) {
            case 'AREA_360':
                hitbox = this.createArea360Hitbox(player, area, strategyStats);
                break;
            case 'THRUST':
                hitbox = this.createThrustHitbox(player, area, strategyStats);
                break;
            case 'WAVE':
                hitbox = this.createWaveHitbox(player, area, duration, strategyStats);
                break;
            case 'FRONT_SWING':
            default:
                hitbox = this.createFrontSwingHitbox(player, area, strategyStats);
                break;
        }

        if (!hitbox) return;

        // Setup physics
        this.scene.physics.world.enable(hitbox);
        hitbox.body.setAllowGravity(false);
        hitbox.body.moves = false;

        // Hit detection
        this.performHitDetection(hitbox, hitTargets, enemySpawner);

        // Cleanup
        this.scene.time.delayedCall(duration, () => hitbox.destroy());
    }

    createFrontSwingHitbox(player, area, strategyStats) {
        const base = strategyStats.meleeHitbox ?? { width: 200, height: 100 };
        const width = base.width * area;
        const height = base.height * area;

        let offsetX = 0;
        if (strategyStats.frontalAttack !== false) {
            offsetX = (width / 2) * (player.facingRight ? 1 : -1);
        } else {
            offsetX = (strategyStats.meleeOffsetHitbox?.x ?? 0) * (player.facingRight ? 1 : -1);
        }

        return this.scene.add.zone(
            player.x + offsetX,
            player.y,
            width,
            height
        );
    }

    createArea360Hitbox(player, area, strategyStats) {
        // Circular hitbox around player
        const base = strategyStats.meleeHitbox ?? { width: 100, height: 100 };
        const radius = (base.width / 2) * area;

        return this.scene.add.zone(
            player.x,
            player.y,
            radius * 2,
            radius * 2
        );
    }

    createThrustHitbox(player, area, strategyStats) {
        // Long, narrow rectangular hitbox in facing direction
        const base = strategyStats.meleeHitbox ?? { width: 250, height: 60 };
        const width = base.width * area;
        const height = base.height * area;

        // Offset logic: move it forward from player center
        const offsetX = (width / 2) * (player.facingRight ? 1 : -1);
        const configOffset = (strategyStats.meleeOffsetHitbox?.x ?? 0) * (player.facingRight ? 1 : -1);

        return this.scene.add.zone(
            player.x + offsetX + configOffset,
            player.y,
            width,
            height
        );
    }

    createWaveHitbox(player, area, duration, strategyStats) {
        // Primary hitbox (frontal)
        const base = strategyStats.meleeHitbox ?? { width: 180, height: 120 };
        const primaryWidth = base.width * area;
        const primaryHeight = base.height * area;
        const offsetX = (primaryWidth / 2) * (player.facingRight ? 1 : -1);

        const primaryHitbox = this.scene.add.zone(
            player.x + offsetX,
            player.y,
            primaryWidth,
            primaryHeight
        );

        // Secondary wave spawns after delay
        this.scene.time.delayedCall(duration * 0.6, () => {
            if (!player || !player.isActive || !this.scene) return;

            const waveHitbox = this.createSecondaryWave(player, area);
            if (waveHitbox) {
                this.scene.physics.world.enable(waveHitbox);
                waveHitbox.body.setAllowGravity(false);
                waveHitbox.body.moves = false;

                const waveTargets = new Set();
                this.performHitDetection(waveHitbox, waveTargets, this.weapon.enemySpawner);

                // Create visual wave effect
                this.createWaveVisual(player, area, duration * 0.4);

                this.scene.time.delayedCall(duration * 0.4, () => waveHitbox.destroy());
            }
        });

        return primaryHitbox;
    }

    createWaveVisual(player, area, duration) {
        const facing = player.facingRight ? 1 : -1;
        const waveDistance = 100 * area * facing;

        // Create expanding arc graphic
        const waveGraphic = this.scene.add.graphics();

        // Safety check for depth access
        const baseDepth = player?.player?.sprite?.depth || 10;
        waveGraphic.setDepth(baseDepth - 1);

        // Initial wave properties
        const startX = player.x;
        const startY = player.y;

        // Animate wave expansion
        let progress = 0;
        const waveTimer = this.scene.time.addEvent({
            delay: 16,
            repeat: Math.floor(duration / 16),
            callback: () => {
                progress += 16 / duration;
                waveGraphic.clear();

                // Draw expanding arc
                const currentDistance = waveDistance * progress;
                const currentAlpha = 1 - progress;
                const currentWidth = 60 * area * (1 + progress);

                waveGraphic.lineStyle(4, 0xFFAA00, currentAlpha);
                waveGraphic.fillStyle(0xFFAA00, currentAlpha * 0.3);

                // Arc shape
                waveGraphic.beginPath();
                waveGraphic.arc(
                    startX + currentDistance,
                    startY,
                    currentWidth,
                    facing > 0 ? -Math.PI / 3 : Math.PI * 2 / 3,
                    facing > 0 ? Math.PI / 3 : Math.PI * 4 / 3,
                    false
                );
                waveGraphic.strokePath();
                waveGraphic.fillPath();

                if (progress >= 1) {
                    waveGraphic.destroy();
                }
            }
        });
    }

    createSecondaryWave(player, area) {
        // Larger, extended hitbox for wave effect
        const waveWidth = 220 * area;
        const waveHeight = 140 * area;
        const offsetX = (waveWidth / 2) * (player.facingRight ? 1 : -1);

        return this.scene.add.zone(
            player.x + offsetX,
            player.y,
            waveWidth,
            waveHeight
        );
    }

    performHitDetection(hitbox, hitTargets, enemySpawner) {
        // 1. Hit Enemies
        this.scene.physics.overlap(hitbox, enemySpawner.group, (_, enemySprite) => {
            const enemy = enemySprite.getData('parent');
            if (!enemy?.isActive || hitTargets.has(enemy)) return;

            this.applyDamage(enemy);
            hitTargets.add(enemy);
        });

        // 2. Hit Structures
        if (this.scene.structureSystem && this.scene.structureSystem.group) {
            this.scene.physics.overlap(hitbox, this.scene.structureSystem.group, (_, structureContainer) => {
                const structure = structureContainer.getData('parent');
                if (!structure?.isActive || hitTargets.has(structure)) return;

                this.applyDamage(structure);
                hitTargets.add(structure);
            });
        }
    }

    applyDamage(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;
        const { damage, isCritical } = weapon.calculateDamage();
        const effects = config.effects || {};

        // Helper to check if target is a Structure
        const isStructure = target.container && target.container.getData('isStructure');

        // Apply Status Effects (Only for Enemies)
        if (!isStructure && effects.elemental && effects.elemental !== 'none') {
            target.applyEffect(
                effects.elemental,
                current.dotDamage,
                effects.dotDuration || 0
            );
        }

        target.takeDamage(damage, isCritical, player);

        // Apply Knockback (Only for Enemies)
        if (!isStructure) {
            const kb = current.knockback;
            const kbDuration = current.knockbackDuration;
            target.applyKnockback(kb, kbDuration);
        }
    }

    getWeaponSprite() {
        const weaponManager = this.scene.weaponManager;
        if (!weaponManager || !weaponManager.weapons || weaponManager.weapons.length === 0) {
            return null;
        }

        const weaponKey = this.weapon.config.key;
        const weapon = weaponManager.weapons.find(s => s.weaponKey === weaponKey);

        if (!weapon) {
            console.warn(`[MeleeWeaponStrategy] Weapon sprite not found for key: ${weaponKey}`);
            return null;
        }

        return weapon.sprite;
    }
}
