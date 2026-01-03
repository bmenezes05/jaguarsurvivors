import { CompanionLegendary } from './CompanionLegendary.js';

/**
 * AttackCompanion
 * 
 * A companion that follows the player and attacks nearby enemies with projectiles.
 * 
 * Behavior:
 * - Follows player with offset
 * - Scans for enemies in range
 * - Fires projectiles at nearest enemy
 * - Has attack rate cooldown
 */
export class AttackCompanion extends CompanionLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.attackTimer = 0;
        this.projectiles = [];
    }

    createSprite() {
        const player = this.scene.player;

        this.sprite = this.scene.add.sprite(
            player.x + this.offset.x,
            player.y + this.offset.y,
            this.config.sprite || 'enemy_jaguar'
        );

        this.sprite.setScale(this.config.scale || 0.6);
        this.sprite.setTint(this.config.tint || 0x00FFFF);

        // Add idle animation if available
        this.sprite.setDepth(player.depth - 1);
    }

    updateBehavior(delta) {
        this.attackTimer += delta;

        const attackRate = this.config.attackRate || 1500;

        if (this.attackTimer >= attackRate) {
            this.attack();
            this.attackTimer = 0;
        }

        // Clean up destroyed projectiles
        this.projectiles = this.projectiles.filter(p => p.active);
    }

    attack() {
        const range = this.config.range || 300;
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];

        if (enemies.length === 0) return;

        // Find nearest enemy
        let nearest = null;
        let minDist = range;

        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                enemy.x,
                enemy.y
            );

            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        });

        if (nearest) {
            this.fireProjectile(nearest);
        }
    }

    fireProjectile(target) {
        const proj = this.scene.physics.add.image(
            this.sprite.x,
            this.sprite.y,
            this.config.projectileSprite || 'weapon_laser_gun'
        );

        proj.setScale(0.4);
        proj.setTint(this.config.tint || 0x00FFFF);

        const angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            target.x,
            target.y
        );

        const speed = this.config.projectileSpeed || 500;
        proj.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        proj.rotation = angle;

        this.projectiles.push(proj);

        const damage = this.config.damage || 35;

        // Setup collision
        this.scene.physics.add.overlap(
            proj,
            this.scene.enemySpawner.group,
            (projectile, enemySprite) => {
                const enemy = enemySprite.getData('parent');
                if (enemy && enemy.isActive) {
                    enemy.takeDamage(damage);
                    projectile.destroy();
                }
            }
        );

        // Auto-destroy after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            if (proj.active) proj.destroy();
        });
    }

    destroy() {
        if (!this.isActive) return;

        // Clean up all projectiles
        this.projectiles.forEach(proj => {
            if (proj.active) proj.destroy();
        });
        this.projectiles = [];

        super.destroy();
    }
}
