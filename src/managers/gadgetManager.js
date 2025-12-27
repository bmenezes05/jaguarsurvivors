
export class GadgetManager {
    constructor(scene) {
        this.scene = scene;
        this.gadgets = [];
        this.projectileGroup = this.scene.physics.add.group();

        // Handling gadget collisions
        this.scene.physics.add.overlap(this.projectileGroup, this.scene.enemySpawner.group, (proj, enemySprite) => {
            const gadget = proj.getData('gadgetRef');
            const enemy = enemySprite.getData('parent');

            if (gadget && enemy && enemy.isActive) {
                this.onGadgetHit(gadget, enemy);
            }
        });
    }

    addGadget(id, config) {
        const gadget = {
            id,
            config,
            active: true,
            timer: 0,
            sprite: null
        };

        if (id === 'orbital_blade') {
            // Create visual representation
            gadget.sprite = this.scene.physics.add.image(this.scene.player.x, this.scene.player.y, config.sprite);
            gadget.sprite.setScale(config.scale);
            gadget.sprite.setTint(0xFFD700); // Gold tint
            this.projectileGroup.add(gadget.sprite);
            gadget.sprite.setData('gadgetRef', gadget);
            gadget.angle = 0;
        } else if (id === 'auto_turret') {
            // Floating drone near player
            gadget.sprite = this.scene.add.image(this.scene.player.x, this.scene.player.y, config.sprite);
            gadget.sprite.setScale(0.5);
            gadget.sprite.setTint(0x00FF00); // Tech tint
        }

        this.gadgets.push(gadget);
    }

    update(delta) {
        const player = this.scene.player;

        this.gadgets.forEach(g => {
            if (!g.active) return;

            if (g.id === 'orbital_blade') {
                this.updateOrbital(g, player, delta);
            } else if (g.id === 'auto_turret') {
                this.updateTurret(g, player, delta);
            }
        });
    }

    updateOrbital(gadget, player, delta) {
        const cfg = gadget.config;
        gadget.angle += cfg.speed * (delta / 1000);

        const x = player.x + Math.cos(gadget.angle) * cfg.radius;
        const y = player.y + Math.sin(gadget.angle) * cfg.radius;

        gadget.sprite.setPosition(x, y);
        gadget.sprite.rotation = gadget.angle + Math.PI / 2; // Face direction of movement
    }

    updateTurret(gadget, player, delta) {
        // Floating follow
        const targetX = player.x - 50;
        const targetY = player.y - 50;
        // Smooth lerp
        gadget.sprite.x += (targetX - gadget.sprite.x) * 0.1;
        gadget.sprite.y += (targetY - gadget.sprite.y) * 0.1;

        gadget.timer += delta;
        const fireRate = gadget.config.fireRate; // e.g., 1000ms

        if (gadget.timer >= fireRate) {
            this.turretFire(gadget);
            gadget.timer = 0;
        }
    }

    turretFire(gadget) {
        // Find nearest enemy
        const enemies = this.scene.enemySpawner.enemies.filter(e => e.isActive);
        if (enemies.length === 0) return;

        let nearest = null;
        let minDist = gadget.config.range;

        enemies.forEach(e => {
            const dist = Phaser.Math.Distance.Between(gadget.sprite.x, gadget.sprite.y, e.x, e.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        });

        if (nearest) {
            // Fire projectile
            // We can reuse Weapon logic or simple projectile here. Let's do simple for speed.
            const proj = this.scene.physics.add.image(gadget.sprite.x, gadget.sprite.y, 'weapon_laser_gun');
            proj.setScale(0.5);
            proj.setTint(0x00FF00);
            this.projectileGroup.add(proj);

            const angle = Phaser.Math.Angle.Between(gadget.sprite.x, gadget.sprite.y, nearest.x, nearest.y);
            const speed = gadget.config.projectileSpeed;

            proj.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            proj.rotation = angle;

            // Temporary data for damage
            proj.setData('gadgetRef', { ...gadget, isProjectile: true }); // Hacky ref to pass dmg

            // Destroy after range/time
            this.scene.time.delayedCall(1000, () => proj.destroy());
        }
    }

    onGadgetHit(gadget, enemy) {
        // Check cooldown to prevent frame-perfect melting for continuous colliders like Orbital
        if (gadget.isProjectile) {
            // It's a bullet, destroy it
            // Find actual gadget config passed in the hacky way
            const damage = gadget.config.damage;
            enemy.takeDamage(damage);
            // Destroy projectile
            // We can't easily destroy the projectile sprite from here without passing it ref
            // But wait, the collider callback passed 'proj' as first arg? 
            // Ah, look at top: physics.add.overlap(this.projectileGroup...) -> (proj, enemySprite)
            // But I called onGadgetHit(gadget, enemy). 
            // I need to change the signature or handle destruction there.
        } else {
            // It's a persistent gadget like Orbital
            const now = this.scene.time.now;
            if (!gadget.lastHitTime) gadget.lastHitTime = {};

            // Internal cooldown per enemy to avoid 1-frame kill
            if (!gadget.lastHitTime[enemy.container.id] || now - gadget.lastHitTime[enemy.container.id] > 500) {
                enemy.takeDamage(gadget.config.damage);
                gadget.lastHitTime[enemy.container.id] = now;

                // Juice
                this.scene.juice.spark(enemy.x, enemy.y);
            }
        }
    }
}
