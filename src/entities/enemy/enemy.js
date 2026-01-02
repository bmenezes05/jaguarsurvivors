import { CONFIG } from '../../config/config.js';
import { BehaviorFactory } from '../../systems/ai/behaviorFactory.js';
import { BossAIManager } from '../../systems/ai/bossAIManager.js';
import { EnemyEntity } from './enemyEntity.js';
import { EnemyView } from './enemyView.js';
import { EnemyMovement } from './enemyMovement.js';
import { EnemyCombat } from './enemyCombat.js';
import { EnemyStatus } from './enemyStatus.js';
import { EnemyLoot } from './enemyLoot.js';

export class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.isBoss = false;
        this.isActive = false;

        // 1. Core Data
        this.entity = new EnemyEntity();

        // 2. Visuals
        this.view = new EnemyView(scene, this);

        // 3. Systems
        this.movement = new EnemyMovement(scene, this);
        this.combat = new EnemyCombat(scene, this);
        this.status = new EnemyStatus(scene, this);
        this.loot = new EnemyLoot(scene, this);

        // 4. AI
        this.behavior = null;
        this.bossAI = null;
    }

    setActive(value) {
        this.isActive = value;
        if (this.view && this.view.container) {
            this.view.container.setActive(value);
            if (this.view.container.body) {
                this.view.container.body.enable = value;
            }
        }
    }

    setVisible(value) {
        if (this.view && this.view.container) {
            this.view.container.setVisible(value);
        }
    }

    spawn(config) {
        const { x, y, enemyConfig } = config;

        this.isActive = true;
        this.isBoss = enemyConfig.isBoss || false;

        let finalConfig = enemyConfig;
        if (this.scene.difficultyManager) {
            finalConfig = { ...enemyConfig, ...this.scene.difficultyManager.resolveStats(enemyConfig) };
        }

        this.entity.setup(finalConfig);
        this.view.spawn(x, y, finalConfig);
        this.movement.reset();
        this.combat.reset();
        this.status.reset();

        this.initializeAI(finalConfig);
    }

    initializeAI(enemyConfig) {
        if (this.behavior) {
            this.behavior.exit();
            this.behavior = null;
        }
        if (this.bossAI) {
            this.bossAI.destroy();
            this.bossAI = null;
        }

        if (this.isBoss) {
            const phaseConfig = CONFIG.bossPhases?.[enemyConfig.key] || CONFIG.bossPhases?.default;

            if (phaseConfig) {
                this.bossAI = new BossAIManager(this, phaseConfig);
            } else {
                this.behavior = BehaviorFactory.createFromConfig(this, enemyConfig.ai);
                this.behavior.enter();
            }
        } else {
            this.behavior = BehaviorFactory.createFromConfig(this, enemyConfig.ai);
            this.behavior.enter();
        }
    }

    update(player, delta) {
        if (!this.isActive) return;

        this.status.update(delta);

        if (this.entity.isDead()) {
            this.die();
            return;
        }

        if (this.status.isStunned() || this.combat.isBlockingMovement()) {
            this.movement.move(null, delta);
        } else {
            let moveVector = null;

            if (this.bossAI) {
                this.bossAI.update(delta);
                moveVector = this.bossAI.getMovementVector();
            } else if (this.behavior) {
                this.behavior.update(delta);
                moveVector = this.behavior.getMovementVector();
            }

            if (moveVector) {
                moveVector.speed *= this.status.getSpeedMultiplier();
            }

            this.movement.move(moveVector, delta);
        }

        // Update Animation
        this.view.update(delta, this.movement.isMoving);

        this.combat.update(player, delta);
    }

    takeDamage(amount, isCritical, attacker) {
        this.entity.takeDamage(amount);

        this.scene.events.emit('enemy-damaged', this, amount, isCritical, attacker);

        if (this.entity.isDead()) {
            this.die();
        }
    }

    applyEffect(type, damage, duration) {
        this.status.apply(type, { damage, duration });
    }

    applyKnockback(force, duration) {
        const resistance = this.getKnockbackResistance();
        const effectiveForce = force * (1 - resistance);

        if (effectiveForce <= 0) return;

        const angle = Phaser.Math.Angle.Between(
            this.container.x, this.container.y,
            this.scene.player.x, this.scene.player.y
        );
        this.movement.applyKnockback(effectiveForce, duration, angle + Math.PI);
    }

    getKnockbackResistance() {
        if (this.scene.difficultyManager) {
            const profile = this.entity.config.scalingProfile || null;
            return this.scene.difficultyManager.getMultiplier('knockbackResistance', profile);
        }
        return 0;
    }

    die() {
        if (!this.isActive) return;
        this.isActive = false;

        this.view.destroy();
        this.scene.events.emit('enemy-died', this);

        if (this.isBoss) {
            this.scene.events.emit('boss-died', this.x, this.y);
        }

        this.loot.drop();
        this.status.onDeath();
    }

    /**
     * Called by ObjectPool.clear() to permanently remove this instance
     */
    destroy() {
        if (this.view) {
            // Need to ensure the container is actually destroyed here, 
            // unlike in the view.destroy() which just hides it (for pooling)
            if (this.view.container) this.view.container.destroy();
        }
    }

    get x() { return this.view.x; }
    get y() { return this.view.y; }
    get container() { return this.view.container; }
    get health() { return this.entity.health; }
    get maxHealth() { return this.entity.maxHealth; }
    get damage() { return this.entity.damage; }
}
