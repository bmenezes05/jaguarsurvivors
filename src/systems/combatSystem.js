export class CombatSystem {
    constructor(scene) {
        this.scene = scene;

        this.player = scene.player;
        this.enemySpawner = scene.enemySpawner;
        this.playerBody = scene.player.view.container;

        this.registerOverlaps();
    }

    /* ------------------------------------------------------------------ */
    /* ----------------------------- SETUP ------------------------------- */
    /* ------------------------------------------------------------------ */

    registerOverlaps() {
        // Player x Enemies
        if (this.playerBody && this.enemySpawner && this.enemySpawner.group) {
            this.scene.physics.add.overlap(
                this.playerBody,
                this.enemySpawner.group,
                this.onPlayerHitEnemy,
                null,
                this
            );
        } else {
            console.warn("[CombatSystem] Failed to register Player x Enemies overlap: dependencies missing", {
                playerBody: !!this.playerBody,
                enemySpawner: !!this.enemySpawner,
                group: !!this.enemySpawner?.group
            });
        }

        // Projectiles x Enemies (Overlap ÚNICO)
        if (this.scene.projectileGroup && this.enemySpawner && this.enemySpawner.group) {
            this.scene.physics.add.overlap(
                this.scene.projectileGroup,
                this.enemySpawner.group,
                this.onProjectileHitEnemy,
                null,
                this
            );
        }

        // Enemy Projectiles x Player
        if (this.scene.enemyProjectiles && this.playerBody) {
            this.scene.physics.add.overlap(
                this.playerBody,
                this.scene.enemyProjectiles,
                this.onEnemyProjectileHitPlayer,
                null,
                this
            );
        }
    }

    /* ------------------------------------------------------------------ */
    /* --------------------------- COLLISIONS ---------------------------- */
    /* ------------------------------------------------------------------ */

    onEnemyProjectileHitPlayer(playerBody, projectileSprite) {
        if (!projectileSprite.active) return;

        const proj = projectileSprite.getData('parent');
        this.player.takeDamage(proj?.damage || 10);
        projectileSprite.destroy();
    }

    onPlayerHitEnemy(playerBody, enemyContainer) {
        if (!enemyContainer.active || !playerBody.active) return;

        // Inversão: Aqui o player encostou no inimigo e toma dano
        const enemy = enemyContainer.getData('parent');
        if (enemy && enemy.damage) {
            this.player.takeDamage(enemy.damage, enemy);
        }
    }

    onProjectileHitEnemy(projectileSprite, enemyContainer) {
        if (!enemyContainer.active) return;

        const projectile = projectileSprite.getData('projectile') || projectileSprite.getData('parent');
        const enemy = enemyContainer.getData('parent');

        if (projectile && projectile.isActive && enemy) {
            projectile.hit(enemy);
        }
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------ UPDATE ----------------------------- */
    /* ------------------------------------------------------------------ */

    update(time, delta) {
        // Update ALL weapons via WeaponManager (multi-weapon system)
        this.scene.weaponManager?.update(delta);
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------- FX -------------------------------- */
    /* ------------------------------------------------------------------ */

    onWeaponShoot(weaponKey) {
        console.debug("EVENT_EMITTED", { eventName: 'combat-weapon-fired', payload: weaponKey });
        this.scene.events.emit('combat-weapon-fired', weaponKey);
    }
}
