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

        const atkSpeed = player.stats.attackSpeed;
        const duration = (strategyStats.meleeAnimDuration ?? 250) / atkSpeed;

        const baseScale = visual.scale ?? 0.6;
        const scale = baseScale * player.stats.area;

        const facing = player.facingRight ? 1 : -1;
        const radius = player.player.config.bodyWidth * facing;

        const angleOrigin = visual.angleOrigin ?? 0;

        const offsetX = Math.cos(angleOrigin) * radius;
        const offsetY = Math.sin(angleOrigin) * radius;

        sprite
            .setOrigin(visual.gripOrigin?.x ?? 0.5, visual.gripOrigin?.y ?? 1.5)
            .setAngle(visual.angleAttackOrigin ?? 0)
            .setPosition(player.x + offsetX, player.y + offsetY);

        this.scene.tweens.add({
            targets: sprite,
            angle: (visual.angleAttackEnd ?? 180) * facing,
            duration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                sprite
                    .setOrigin(0.5, 0.5)
                    .setAngle(visual.angleOrigin ?? 0)
                    .setPosition(player.x + offsetX, player.y + offsetY);
            }
        });
    }

    spawnHitbox() {
        const { weapon } = this;
        const { config, player, enemySpawner } = weapon;
        const strategyStats = config.strategyStats || {};

        const area = player.stats.area;
        const base = strategyStats.meleeHitbox ?? { width: 200, height: 100 };

        const width = base.width * area;
        const height = base.height * area;
        let offsetX = 0;
        if (strategyStats.frontalAttack) {
            offsetX = (width / 2) * (player.facingRight ? 1 : -1);
        } else {
            offsetX = strategyStats.meleeOffsetHitbox.x * (player.facingRight ? 1 : -1);
        }

        const hitbox = this.scene.add.zone(
            player.x + offsetX,
            player.y,
            width,
            height
        );

        this.scene.physics.world.enable(hitbox);
        hitbox.body.setAllowGravity(false);
        hitbox.body.moves = false;

        const hitEnemies = new Set();

        this.scene.physics.overlap(hitbox, enemySpawner.group, (_, enemySprite) => {
            const enemy = enemySprite.getData('parent');
            if (!enemy?.isActive || hitEnemies.has(enemy)) return;

            this.applyDamage(enemy);
            hitEnemies.add(enemy);
        });

        const atkSpeed = player.stats.attackSpeed;
        const duration = (strategyStats.meleeAnimDuration ?? 250) / atkSpeed;

        this.scene.time.delayedCall(duration, () => hitbox.destroy());
    }

    applyDamage(enemy) {
        const { weapon } = this;
        const { config, player, current } = weapon;
        const { damage, isCritical } = weapon.calculateDamage();
        const effects = config.effects || {};
        if (effects.elemental && effects.elemental !== 'none') {
            enemy.applyEffect(
                effects.elemental,
                current.dotDamage,
                effects.dotDuration || 0
            );
        }

        enemy.takeDamage(damage, isCritical, player);

        // Use calculated current knockback
        const kb = current.knockback;
        const kbDuration = current.knockbackDuration;

        enemy.applyKnockback(kb, kbDuration);
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
