import { BaseBehavior } from '../baseBehavior.js';

/**
 * StationaryBurstBehavior
 * 
 * Boss remains stationary (or moves very slowly) and fires bullets in high-intensity bursts.
 * 
 * Parameters:
 * - pauseDuration: Time between bursts in ms (default: 2000)
 * - shotsPerBurst: Number of shots in one burst (default: 10)
 * - fireRate: Time between shots within a burst in ms (default: 100)
 * - idleSpeed: Movement speed multiplier while not firing (default: 0)
 * - telegraphDuration: Time to telegraph before starting a burst (default: 1000)
 */
export class StationaryBurstBehavior extends BaseBehavior {
    static STATES = {
        WAITING: 'waiting',
        TELEGRAPHING: 'telegraphing',
        FIRING: 'firing'
    };

    constructor(enemy, params = {}) {
        super(enemy, params);
        this.stateTimer = 0;
        this.burstCount = 0;
    }

    enter() {
        super.enter();
        this.state = StationaryBurstBehavior.STATES.WAITING;
        this.stateTimer = 0;
    }

    update(delta) {
        if (!this.isActive) return;
        this.stateTimer += delta;

        switch (this.state) {
            case StationaryBurstBehavior.STATES.WAITING:
                if (this.stateTimer >= this.getParam('pauseDuration', 2000)) {
                    this.transitionTo(StationaryBurstBehavior.STATES.TELEGRAPHING);
                }
                break;
            case StationaryBurstBehavior.STATES.TELEGRAPHING:
                if (this.stateTimer >= this.getParam('telegraphDuration', 1000)) {
                    this.startBurst();
                }
                break;
            case StationaryBurstBehavior.STATES.FIRING:
                if (this.stateTimer >= this.getParam('fireRate', 100)) {
                    this.fire();
                }
                break;
        }
    }

    transitionTo(newState) {
        this.state = newState;
        this.stateTimer = 0;

        if (newState === StationaryBurstBehavior.STATES.TELEGRAPHING) {
            // Optional: trigger a visual telegraph via VFX or enemy combat
            // For now, we rely on the behavior's state
        }
    }

    startBurst() {
        this.state = StationaryBurstBehavior.STATES.FIRING;
        this.stateTimer = 0;
        this.burstCount = 0;
    }

    fire() {
        const player = this.getPlayer();
        if (player && this.enemy.combat) {
            this.enemy.combat.shoot(player);
        }

        this.burstCount++;
        this.stateTimer = 0;

        if (this.burstCount >= this.getParam('shotsPerBurst', 10)) {
            this.transitionTo(StationaryBurstBehavior.STATES.WAITING);
        }
    }

    getMovementVector() {
        const idleSpeed = this.getParam('idleSpeed', 0);
        if (idleSpeed > 0 && this.state === StationaryBurstBehavior.STATES.WAITING) {
            const dir = this.getDirectionToPlayer();
            return { x: dir.x, y: dir.y, speed: idleSpeed };
        }
        return { x: 0, y: 0, speed: 0 };
    }
}
