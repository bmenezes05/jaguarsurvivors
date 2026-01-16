import { BaseBehavior } from '../baseBehavior.js';

/**
 * TacticalChaseBehavior
 * 
 * Alternates between chasing the player and repositioning to a certain distance.
 * 
 * Parameters:
 * - chaseDuration: Duration of chase phase in ms (default: 3000)
 * - repositionDuration: Duration of reposition phase in ms (default: 2000)
 * - preferredDistance: Desired distance to player during repositioning in px (default: 300)
 * - approachSpeed: Speed multiplier during chase (default: 1.2)
 * - retreatSpeed: Speed multiplier when too close during repositioning (default: 0.8)
 */
export class TacticalChaseBehavior extends BaseBehavior {
    static STATES = {
        CHASING: 'chasing',
        REPOSITIONING: 'repositioning'
    };

    constructor(enemy, params = {}) {
        super(enemy, params);
        this.stateTimer = 0;
    }

    enter() {
        super.enter();
        this.state = TacticalChaseBehavior.STATES.CHASING;
        this.stateTimer = 0;
    }

    update(delta) {
        if (!this.isActive) return;
        this.stateTimer += delta;

        const chaseDuration = this.getParam('chaseDuration', 3000);
        const repositionDuration = this.getParam('repositionDuration', 2000);

        if (this.state === TacticalChaseBehavior.STATES.CHASING && this.stateTimer >= chaseDuration) {
            this.state = TacticalChaseBehavior.STATES.REPOSITIONING;
            this.stateTimer = 0;
        } else if (this.state === TacticalChaseBehavior.STATES.REPOSITIONING && this.stateTimer >= repositionDuration) {
            this.state = TacticalChaseBehavior.STATES.CHASING;
            this.stateTimer = 0;
        }
    }

    getMovementVector() {
        const player = this.getPlayer();
        if (!player) return { x: 0, y: 0, speed: 0 };

        const dist = this.getDistanceToPlayer();
        const dir = this.getDirectionToPlayer();

        if (this.state === TacticalChaseBehavior.STATES.CHASING) {
            return { x: dir.x, y: dir.y, speed: this.getParam('approachSpeed', 1.2) };
        } else {
            const preferredDist = this.getParam('preferredDistance', 300);
            if (dist < preferredDist - 50) {
                // Retreat if too close
                return { x: -dir.x, y: -dir.y, speed: this.getParam('retreatSpeed', 0.8) };
            } else if (dist > preferredDist + 50) {
                // Approach slowly if too far
                return { x: dir.x, y: dir.y, speed: 0.5 };
            }
            // Orbiting movement when at preferred distance
            return { x: -dir.y, y: dir.x, speed: 0.6 };
        }
    }
}
