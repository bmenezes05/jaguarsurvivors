import { WeaponStrategy } from '../weaponStrategy.js';
import { OrbitalProjectile } from '../../projectile/orbitalProjectile.js';
import { createProjectileGroup } from '../../projectile/projectileGroup.js';

export class OrbitalWeaponStrategy extends WeaponStrategy {
    constructor(weapon) {
        super(weapon);

        this.projectiles = [];
        this.orbitalAngle = 0;
        this.projectileCount = weapon.config.strategyStats?.projectileCount || 5;
        this.orbitRadius = weapon.config.strategyStats?.orbitRadius || 120;
        this.rotationSpeed = weapon.config.strategyStats?.rotationSpeed || 0.003; // rad per ms

        if (!this.scene.projectileGroup) {
            this.scene.projectileGroup = createProjectileGroup(this.scene);
        }
        this.projectileGroup = this.scene.projectileGroup;

        this.initProjectiles();
    }

    initProjectiles() {
        const { weapon } = this;
        for (let i = 0; i < this.projectileCount; i++) {
            const proj = new OrbitalProjectile(this.scene, this);
            this.projectiles.push(proj);
            this.projectileGroup.add(proj.visual);

            // Initial configuration but inactive
            proj.init({
                x: 0,
                y: 0,
                damage: 0,
                weapon: {
                    ...weapon.config.strategyStats,
                    projectileVisuals: weapon.config.projectileVisuals,
                    elementalEffect: weapon.config.effects?.elemental,
                    dotDamage: 0,
                    dotDuration: weapon.config.effects?.dotDuration
                },
                isCritical: false
            });
            proj.setActive(false);
            proj.setVisible(false);
        }
    }

    attack(target) {
        // In Orbital strategy, 'attack' is called when weapon cooldown finishes.
        // We use it to reactivate all inactive projectiles.
        const { weapon } = this;
        const { current } = weapon;
        const { damage, isCritical } = weapon.calculateDamage();

        this.projectiles.forEach((proj, index) => {
            if (!proj.isActive) {
                proj.damage = damage;
                proj.isCritical = isCritical;

                // Update config-based stats
                proj.weapon = {
                    ...weapon.config.strategyStats,
                    trailSize: current.trailSize, // Use dynamic size
                    projectileVisuals: weapon.config.projectileVisuals,
                    elementalEffect: weapon.config.effects?.elemental,
                    dotDamage: current.dotDamage,
                    dotDuration: weapon.config.effects?.dotDuration
                };

                proj.setActive(true);
                proj.setVisible(true);
                proj.applyVisuals(); // Re-apply visuals to update hitbox size if area increased
            }
        });
    }

    update(delta) {
        const { player, current } = this.weapon;
        if (!player) return;

        // Update rotation angle
        this.orbitalAngle += this.rotationSpeed * delta;

        // Position projectiles
        const radius = current.orbitRadius || this.orbitRadius;

        this.projectiles.forEach((proj, index) => {
            const angle = this.orbitalAngle + (index * (Math.PI * 2 / this.projectileCount));
            const x = player.x + Math.cos(angle) * radius;
            const y = player.y + Math.sin(angle) * radius;

            if (proj.isActive) {
                proj.visual.setPosition(x, y);
                proj.visual.setVisible(true);

                // Keep them facing the orbit direction
                const visuals = this.weapon.config.projectileVisuals || {};
                const rotationOffset = visuals.rotationOffset || 0;
                proj.visual.rotation = angle + Math.PI / 2 + rotationOffset;
            } else {
                // If inactive, keep hidden and follow player at center
                // This prevents "stuck" projectiles at hitting positions
                proj.visual.setPosition(player.x, player.y);
                proj.visual.setVisible(false);
            }
        });
    }

    onProjectileHit(projectile) {
        // Projectile calls this when it hits something
        // It already called kill() on itself
    }

    destroy() {
        this.projectiles.forEach(proj => {
            if (proj.visual) {
                this.projectileGroup.remove(proj.visual);
                proj.visual.destroy();
            }
        });
        this.projectiles = [];
    }
}
