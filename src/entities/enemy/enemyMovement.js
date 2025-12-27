export class EnemyMovement {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.knockbackTimer = 0;
    }

    reset() {
        this.knockbackTimer = 0;
    }

    update(player, delta) {
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= delta;
            return;
        }

        const speed = this.enemy.entity.speed;
        const angle = Phaser.Math.Angle.Between(
            this.enemy.x,
            this.enemy.y,
            player.x,
            player.y
        );

        this.enemy.view.container.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    applyKnockback(force, duration) {
        this.knockbackTimer = duration;
        // velocity logic aqui
    }
}
