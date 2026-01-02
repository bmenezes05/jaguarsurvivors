import { BaseBehavior } from '../baseBehavior.js';
/**
 * ChargeBehavior
 * 
 * Enemy winds up, then charges rapidly in a straight line.
 * Direction is locked at the moment the charge starts.
 * 
 * States: IDLE → CHARGING_UP → CHARGING → COOLDOWN → (repeat)
 * 
 * Parameters:
 * - chargeUpTime: Duration of wind-up phase in ms (default: 800)
 * - chargeSpeed: Speed multiplier during charge (default: 3.0)
 * - chargeDuration: How long the charge lasts in ms (default: 500)
 * - cooldownTime: Time before next charge in ms (default: 1500)
 * - idleSpeed: Speed during idle/cooldown phase (default: 0.3)
 * - lockDirection: If true, direction locked at charge start (default: true)
 */
export class ChargeBehavior extends BaseBehavior {
    static STATES = {
        IDLE: 'idle',
        CHARGING_UP: 'charging_up',
        CHARGING: 'charging',
        COOLDOWN: 'cooldown'
    };
    constructor(enemy, params = {}) {
        super(enemy, params);

        this.chargeDirection = { x: 0, y: 0 };
        this.stateTimer = 0;
    }
    enter() {
        super.enter();
        this.state = ChargeBehavior.STATES.IDLE;
        this.stateTimer = 0;

        // Start with a brief idle before first charge
        const idleTime = this.getParam('initialIdleTime', 500);
        this.stateTimer = -idleTime;
    }
    update(delta) {
        if (!this.isActive) return;
        this.stateTimer += delta;
        switch (this.state) {
            case ChargeBehavior.STATES.IDLE:
                this.updateIdle(delta);
                break;
            case ChargeBehavior.STATES.CHARGING_UP:
                this.updateChargingUp(delta);
                break;
            case ChargeBehavior.STATES.CHARGING:
                this.updateCharging(delta);
                break;
            case ChargeBehavior.STATES.COOLDOWN:
                this.updateCooldown(delta);
                break;
        }
    }
    updateIdle() {
        // Wait a bit before starting charge-up
        if (this.stateTimer >= 0) {
            this.transitionTo(ChargeBehavior.STATES.CHARGING_UP);
        }
    }
    updateChargingUp(delta) {
        const chargeUpTime = this.getParam('chargeUpTime', 800);

        // Lock direction at start of charge-up or keep tracking
        const lockDirection = this.getParam('lockDirection', true);
        if (!lockDirection || this.stateTimer <= delta) {
            this.chargeDirection = this.getDirectionToPlayer();
        }
        if (this.stateTimer >= chargeUpTime) {
            // Lock direction at moment of charge if not already locked
            if (!lockDirection) {
                this.chargeDirection = this.getDirectionToPlayer();
            }
            this.transitionTo(ChargeBehavior.STATES.CHARGING);
        }
    }
    updateCharging() {
        const chargeDuration = this.getParam('chargeDuration', 500);

        if (this.stateTimer >= chargeDuration) {
            this.transitionTo(ChargeBehavior.STATES.COOLDOWN);
        }
    }
    updateCooldown() {
        const cooldownTime = this.getParam('cooldownTime', 1500);

        if (this.stateTimer >= cooldownTime) {
            this.transitionTo(ChargeBehavior.STATES.CHARGING_UP);
        }
    }
    transitionTo(newState) {
        this.state = newState;
        this.stateTimer = 0;

        // Emit event for visual/audio feedback
        if (this.enemy.scene) {
            console.debug('BEHAVIOR_STATE_CHANGE', {
                enemy: this.enemy.enemy?.key,
                behavior: 'charge',
                state: newState
            });
        }
    }
    getMovementVector() {
        switch (this.state) {
            case ChargeBehavior.STATES.IDLE:
            case ChargeBehavior.STATES.COOLDOWN:
                // Slow approach during idle/cooldown
                const dir = this.getDirectionToPlayer();
                const idleSpeed = this.getParam('idleSpeed', 0.3);
                return { x: dir.x, y: dir.y, speed: idleSpeed };
            case ChargeBehavior.STATES.CHARGING_UP:
                // Stand still or slow down during wind-up
                const chargeUpSpeed = this.getParam('chargeUpSpeed', 0);
                if (chargeUpSpeed > 0) {
                    const d = this.getDirectionToPlayer();
                    return { x: d.x, y: d.y, speed: chargeUpSpeed };
                }
                return { x: 0, y: 0, speed: 0 };
            case ChargeBehavior.STATES.CHARGING:
                // Full speed charge in locked direction
                const chargeSpeed = this.getParam('chargeSpeed', 3.0);
                return {
                    x: this.chargeDirection.x,
                    y: this.chargeDirection.y,
                    speed: chargeSpeed
                };
            default:
                return { x: 0, y: 0, speed: 0 };
        }
    }
    /**
     * Returns true when a full charge cycle is complete.
     */
    isComplete() {
        return this.state === ChargeBehavior.STATES.COOLDOWN &&
            this.stateTimer >= this.getParam('cooldownTime', 1500);
    }
    /**
     * Charge cannot be interrupted during charging phase.
     */
    canInterrupt() {
        return this.state !== ChargeBehavior.STATES.CHARGING;
    }
}