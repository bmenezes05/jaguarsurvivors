import { EnemyBehavior } from '../enemyBehavior.js';

export class BossBehavior extends EnemyBehavior {
    constructor(enemy) {
        super(enemy);
        this.phaseTimer = 0;
        this.phase = 0;
    }

    update(player, delta) {
        this.phaseTimer += delta;

        if (this.phaseTimer > 3000) {
            this.phase = (this.phase + 1) % 2;
            this.phaseTimer = 0;
        }

        if (this.phase === 0) {
            this.chase(player);
        } else {
            this.pause();
        }
    }

    chase(player) {
        const dx = player.x - this.enemy.x;
        const dy = player.y - this.enemy.y;
        const distance = Math.hypot(dx, dy);

        if (distance === 0) return;

        this.enemy.body.setVelocity(
            (dx / distance) * this.enemy.speed,
            (dy / distance) * this.enemy.speed
        );
    }

    pause() {
        this.enemy.body.setVelocity(0, 0);
    }
}
