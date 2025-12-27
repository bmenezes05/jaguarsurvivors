import { EnemyEntity } from './enemyEntity.js';
import { EnemyView } from './enemyView.js';
import { EnemyMovement } from './enemyMovement.js';
import { EnemyCombat } from './enemyCombat.js';
import { EnemyStatus } from './enemyStatus.js';
import { EnemyAI } from './enemyAI.js';

export class EnemyFacade {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;

        this.entity = new EnemyEntity(config);
        this.view = new EnemyView(scene, config);
        this.movement = new EnemyMovement(this.view, this.entity);
        this.combat = new EnemyCombat(scene, this);
        this.status = new EnemyStatus(this.entity);

        this.behavior = EnemyAI.createBehavior(this);
    }

    spawn(x, y) {
        this.view.setPosition(x, y);
        this.view.setActive(true);
        this.movement.enable();
    }

    update(player, delta) {
        if (!this.view.isActive()) return;

        this.status.update(delta);
        this.behavior.update(player, delta);
    }

    takeDamage(amount) {
        this.entity.health -= amount;
        this.view.flashDamage();

        if (this.entity.health <= 0) {
            this.die();
        }
    }

    die() {
        this.view.destroy();
        // drop, events, pool release
    }
}
