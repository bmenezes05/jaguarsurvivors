export class CombatSystem {
    constructor(scene) {
        this.scene = scene;

        this.player = scene.player;
        this.enemySpawner = scene.enemySpawner;
        this.playerBody = scene.player.view.container;
        this.structureSystem = scene.structureSystem;

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

        // Projectiles x Enemies
        if (this.scene.projectileGroup && this.enemySpawner && this.enemySpawner.group) {
            this.scene.physics.add.overlap(
                this.scene.projectileGroup,
                this.enemySpawner.group,
                this.onProjectileHitEnemy,
                null,
                this
            );
        }

        // Projectiles x Player
        if (this.scene.projectileGroup && this.playerBody) {
            this.scene.physics.add.overlap(
                this.playerBody,
                this.scene.projectileGroup,
                this.onProjectileHitPlayer,
                null,
                this
            );
        }

        // Player x Structures (COLLIDER - Blocks movement)
        if (this.playerBody && this.structureSystem && this.structureSystem.group) {
            this.scene.physics.add.collider(
                this.playerBody,
                this.structureSystem.group
            );
        }

        // Projectiles x Structures (OVERLAP - Damage)
        if (this.scene.projectileGroup && this.structureSystem && this.structureSystem.group) {
            this.scene.physics.add.overlap(
                this.scene.projectileGroup,
                this.structureSystem.group,
                this.onProjectileHitStructure,
                null,
                this
            );
        }

        // // Enemies x Structures (COLLIDER - Blocks movement)
        // if (this.enemySpawner && this.enemySpawner.group && this.structureSystem && this.structureSystem.group) {
        //     this.scene.physics.add.collider(
        //         this.enemySpawner.group,
        //         this.structureSystem.group
        //     );
        // }
    }

    /* ------------------------------------------------------------------ */
    /* --------------------------- COLLISIONS ---------------------------- */
    /* ------------------------------------------------------------------ */

    onProjectileHitPlayer(playerBody, projectileSprite) {
        const projectile = projectileSprite.getData('projectile');
        if (!projectile || !projectile.isActive || !projectile.isEnemy) {
            return;
        }

        this.player.takeDamage(Math.ceil(projectile.damage || 10));
        projectile.kill();
    }

    onPlayerHitEnemy(playerBody, enemyContainer) {
        if (!enemyContainer.active || !playerBody.active) return;

        // Inversão: Aqui o player encostou no inimigo e toma dano
        const enemy = enemyContainer.getData('parent');
        if (enemy && enemy.damage) {
            this.player.takeDamage(Math.ceil(enemy.damage), enemy);
        }
    }

    onProjectileHitEnemy(projectileSprite, enemyContainer) {
        const projectile = projectileSprite.getData('projectile');
        if (!projectile || !projectile.isActive || projectile.isEnemy) {
            return;
        }

        const enemy = enemyContainer.getData('parent');
        if (enemy && enemyContainer.active) {
            projectile.hit(enemy);
        }
    }

    onProjectileHitStructure(projectileSprite, structureContainer) {
        if (!structureContainer.active) return;

        const projectile = projectileSprite.getData('projectile') || projectileSprite.getData('parent');
        const structure = structureContainer.getData('parent');

        if (projectile && projectile.isActive && structure) {
            // Hit logic similar to enemy
            if (typeof structure.takeDamage === 'function') {
                structure.takeDamage(projectile.damage, projectile.isCritical);
            }
            projectile.kill();
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
