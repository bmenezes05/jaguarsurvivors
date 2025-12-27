import { EnemyBehavior } from '../enemyBehavior.js';

export class ChaseBehavior extends EnemyBehavior {
    update(player, delta) {
        const dx = player.x - this.enemy.x;
        const dy = player.y - this.enemy.y;
        const distance = Math.hypot(dx, dy);

        if (distance === 0) return;

        const nx = dx / distance;
        const ny = dy / distance;

        this.enemy.body.setVelocity(
            nx * this.enemy.speed,
            ny * this.enemy.speed
        );
    }
}
