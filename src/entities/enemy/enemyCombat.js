import { EnemyProjectile } from "../enemyProjectile.js";

export class EnemyCombat {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.cooldown = 0;
    }

    reset() {
        this.cooldown = 0;
    }

    update(player, delta) {
        if (this.cooldown > 0) {
            this.cooldown -= delta;
            return;
        }

        if (this.enemy.entity.config.canShoot) {
            this.shoot(player);
            this.cooldown = this.enemy.entity.config.shootInterval;
        }
    }

    shoot(player) {
        const proj = new EnemyProjectile(
            this.scene,
            this.enemy.x,
            this.enemy.y,
            player,
            this.enemy.entity.config
        );
        this.scene.enemyProjectiles.add(proj.sprite);
    }
}
