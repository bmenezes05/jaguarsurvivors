import { ChaseBehavior } from './behaviors/chaseBehavior.js';
import { BossBehavior } from './behaviors/bossBehavior.js';
import { IdleBehavior } from './behaviors/idleBehavior.js';

export class EnemyAI {
    static createBehavior(enemyFacade) {
        if (enemyFacade.entity.isBoss) {
            return new BossBehavior(enemyFacade);
        }

        if (enemyFacade.config.canShoot) {
            return new IdleBehavior(enemyFacade);
        }

        return new ChaseBehavior(enemyFacade);
    }
}
