import { BaseBehavior } from '../baseBehavior.js';

/**
 * RhythmicAreaBehavior
 * 
 * Boss moves irregularly (orbiting + short dashes) and triggers periodic area pulses.
 * 
 * Parameters:
 * - pulseInterval: Time between area pulses in ms (default: 2000)
 * - orbitDuration: Time spent orbiting in ms (default: 3000)
 * - dashDuration: Duration of dash phase in ms (default: 500)
 * - dashSpeed: Speed multiplier during dash (default: 4.0)
 * - orbitSpeed: Speed multiplier during orbit (default: 1.0)
 * - orbitDirection: 1 (clockwise) or -1 (counter-clockwise) (default: 1)
 */
export class RhythmicAreaBehavior extends BaseBehavior {
    static STATES = {
        ORBITING: 'orbiting',
        DASHING: 'dashing'
    };

    constructor(enemy, params = {}) {
        super(enemy, params);
        this.pulseTimer = 0;
        this.stateTimer = 0;
        this.dashDir = { x: 0, y: 0 };
    }

    enter() {
        super.enter();
        this.state = RhythmicAreaBehavior.STATES.ORBITING;
        this.stateTimer = 0;
        this.pulseTimer = 0;
    }

    update(delta) {
        if (!this.isActive) return;
        this.stateTimer += delta;
        this.pulseTimer += delta;

        // Periodic Area Pulse (disruption)
        const pulseInterval = this.getParam('pulseInterval', 2000);
        if (this.pulseTimer >= pulseInterval) {
            this.pulseTimer = 0;
            this.triggerPulse();
        }

        // State Transitions
        const orbitDur = this.getParam('orbitDuration', 3000);
        const dashDur = this.getParam('dashDuration', 500);

        if (this.state === RhythmicAreaBehavior.STATES.ORBITING && this.stateTimer >= orbitDur) {
            this.startDash();
        } else if (this.state === RhythmicAreaBehavior.STATES.DASHING && this.stateTimer >= dashDur) {
            this.state = RhythmicAreaBehavior.STATES.ORBITING;
            this.stateTimer = 0;
        }
    }

    startDash() {
        this.state = RhythmicAreaBehavior.STATES.DASHING;
        this.stateTimer = 0;

        const player = this.getPlayer();
        if (player) {
            const dir = this.getDirectionToPlayer();
            this.dashDir = { x: dir.x, y: dir.y };
        } else {
            this.dashDir = { x: 0, y: 0 };
        }
    }

    triggerPulse() {
        // Use existing stomp mechanic for visual/shake effect
        if (this.enemy.combat && typeof this.enemy.combat.performStomp === 'function') {
            this.enemy.combat.performStomp();
        }
    }

    getMovementVector() {
        if (this.state === RhythmicAreaBehavior.STATES.DASHING) {
            return { x: this.dashDir.x, y: this.dashDir.y, speed: this.getParam('dashSpeed', 4.0) };
        } else {
            // Orbiting movement
            const player = this.getPlayer();
            if (!player) return { x: 0, y: 0, speed: 0 };

            const dir = this.getDirectionToPlayer();
            const orbitDir = this.getParam('orbitDirection', 1);

            // Perpendicular vector for orbit
            return {
                x: -dir.y * orbitDir,
                y: dir.x * orbitDir,
                speed: this.getParam('orbitSpeed', 1.0)
            };
        }
    }
}
