import { Projectile } from '../projectile/projectile.js';

export class OrbitalProjectile extends Projectile {
    constructor(scene, strategy) {
        super(scene);
        this.strategy = strategy;
        this.orbitalCooldown = 0;
    }

    // Override kill to handle orbital specific disappearance
    kill() {
        this.setActive(false);
        this.setVisible(false);
        // Don't destroy/release, just stay inactive until strategy reactivates it
    }

    hit(enemy) {
        if (!this.isActive) return;

        enemy.takeDamage(this.damage, this.isCritical);

        if (this.weapon.elementalEffect) {
            enemy.applyEffect(
                this.weapon.elementalEffect,
                this.weapon.dotDamage,
                this.weapon.dotDuration
            );
        }

        // Deactivate this specific projectile
        this.kill();

        // Notify strategy that this projectile was hit
        if (this.strategy && this.strategy.onProjectileHit) {
            this.strategy.onProjectileHit(this);
        }
    }

    // Override update to do nothing, as strategy will control position
    update() { }
}
