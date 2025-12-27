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

        const atkSpeed = player.stats.attackSpeed;
        const duration = (config.meleeAnimDuration ?? 250) / atkSpeed;

        const baseScale = config.scale ?? 0.6;
        const scale = baseScale * player.stats.area;

        const facing = player.facingRight ? 1 : -1;
        const radius = player.player.config.bodyWidth * facing;
        const offsetX = Math.cos(config.angleOrigin) * radius;
        const offsetY = Math.sin(config.angleOrigin) * radius;

        sprite
            .setOrigin(config.gripOrigin?.x ?? 0.5, config.gripOrigin?.y ?? 1.5)
            .setAngle(config.angleOrigin ?? 0)
            .setPosition(player.x + offsetX, player.y + offsetY)
            .setScale(scale);

        this.scene.tweens.add({
            targets: sprite,
            angle: config.angleAttack * facing ?? 0,
            duration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                sprite
                    .setOrigin(0.5, 0.5)
                    .setAngle(0)
                    .setPosition(player.x + offsetX, player.y + offsetY)
                    .setScale(scale);
            }
        });
    }

    spawnHitbox() {
        const { weapon } = this;
        const { config, player, enemySpawner } = weapon;

        const area = player.stats.area;
        const base = config.meleeHitbox ?? { width: 200, height: 100 };

        const width = base.width * area;
        const height = base.height * area;
        const offsetX = (width / 2) * (player.facingRight ? 1 : -1);

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

        const duration =
            (config.meleeAnimDuration ?? 250) /
            player.stats.attackSpeed;

        this.scene.time.delayedCall(duration, () => hitbox.destroy());
    }

    applyDamage(enemy) {
        const { weapon } = this;
        const { config, player, current } = weapon;
        const { damage, isCritical } = weapon.calculateDamage();

        enemy.takeDamage(damage, isCritical, player);

        const kb = config.knockback * player.stats.knockback;
        enemy.applyKnockback(kb, config.knockbackDuration);

        if (config.elementalEffect && config.elementalEffect !== 'none') {
            enemy.applyEffect(
                config.elementalEffect,
                current.dotDamage,
                config.dotDuration
            );
        }
    }

    getWeaponSprite() {
        const weaponManager = this.scene.weaponManager;
        if (!weaponManager || !weaponManager.weaponSprites || weaponManager.weaponSprites.length === 0) {
            return null;
        }

        const weaponKey = this.weapon.config.key;
        return weaponManager.weaponSprites.find(s => s.getData('weaponKey') === weaponKey);
    }
}
