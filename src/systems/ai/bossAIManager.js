import { BehaviorFactory } from './behaviorFactory.js';

/**
 * BossAIManager
 * 
 * Orchestrates complex boss behavior through a phase-based system.
 * Bosses can have multiple phases triggered by health thresholds,
 * each containing a sequence of behaviors that can loop.
 * 
 * Phase triggers:
 * - health: Triggered when health drops to percentage
 * - time: Triggered after elapsed time
 * 
 * Each phase contains a behavior sequence that executes in order.
 */
export class BossAIManager {
    constructor(boss, phaseConfig) {
        this.boss = boss;
        this.phases = phaseConfig.phases || [];
        this.currentPhaseIndex = 0;
        this.currentBehaviorIndex = 0;
        this.behaviorTimer = 0;

        this.currentBehavior = null;
        this.phaseStartTime = 0;

        // Track which phases have been activated
        this.activatedPhases = new Set();

        // Initialize first phase
        if (this.phases.length > 0) {
            this.initializePhase(0);
        }
    }

    /**
     * Initialize a specific phase.
     */
    initializePhase(phaseIndex) {
        const phase = this.phases[phaseIndex];
        if (!phase) return;

        this.currentPhaseIndex = phaseIndex;
        this.currentBehaviorIndex = 0;
        this.behaviorTimer = 0;
        this.phaseStartTime = Date.now();

        // Mark this phase as activated to prevent re-initialization
        this.activatedPhases.add(phaseIndex);

        // Load first behavior of the phase
        this.loadBehavior();

        console.debug('BOSS_PHASE_INIT', {
            boss: this.boss.entity?.config?.key,
            phase: phase.id || phaseIndex,
            name: phase.name
        });
    }

    /**
     * Update the boss AI.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        this.checkPhaseTransition();
        this.updateBehavior(delta);
    }

    /**
     * Check if we should transition to a new phase.
     */
    checkPhaseTransition() {
        const healthPercent = this.boss.health / this.boss.maxHealth;
        const elapsedTime = Date.now() - this.phaseStartTime;

        // Check all phases (in reverse order to catch lower health thresholds first)
        for (let i = this.phases.length - 1; i >= 0; i--) {
            const phase = this.phases[i];

            // Skip already activated phases
            if (this.activatedPhases.has(i)) continue;

            // Check trigger conditions
            if (this.shouldTriggerPhase(phase, healthPercent, elapsedTime)) {
                this.transitionToPhase(i);
                break;
            }
        }
    }

    /**
     * Check if a phase's trigger condition is met.
     */
    shouldTriggerPhase(phase, healthPercent, elapsedTime) {
        const trigger = phase.trigger;
        if (!trigger) return false;

        switch (trigger.type) {
            case 'health':
                return healthPercent <= trigger.value;
            case 'time':
                return elapsedTime >= trigger.value;
            case 'health_above':
                return healthPercent > trigger.value;
            case 'immediate':
                return true;
            default:
                return false;
        }
    }

    /**
     * Transition to a new phase.
     */
    transitionToPhase(phaseIndex) {
        const oldPhase = this.phases[this.currentPhaseIndex];
        const newPhase = this.phases[phaseIndex];

        // Exit current behavior
        if (this.currentBehavior) {
            this.currentBehavior.exit();
        }

        // Emit exit event for old phase
        if (oldPhase?.onExit && this.boss.scene) {
            console.debug('BOSS_PHASE_EXIT', {
                boss: this.boss.entity?.config?.key,
                phase: oldPhase.id,
                event: oldPhase.onExit
            });
            this.boss.scene.events.emit(oldPhase.onExit, this.boss);
        }

        // Initialize new phase (this will mark it as activated)
        this.initializePhase(phaseIndex);

        // Emit enter event for new phase
        if (newPhase?.onEnter && this.boss.scene) {
            console.debug('BOSS_PHASE_ENTER', {
                boss: this.boss.entity?.config?.key,
                phase: newPhase.id,
                event: newPhase.onEnter
            });
            this.boss.scene.events.emit(newPhase.onEnter, this.boss);
        }
    }

    /**
     * Load the current behavior from the phase configuration.
     */
    loadBehavior() {
        const phase = this.phases[this.currentPhaseIndex];

        if (!phase || !phase.behaviors || phase.behaviors.length === 0) {
            console.warn('BossAIManager: No behaviors defined for phase', phase?.id);
            return;
        }

        const behaviorConfig = phase.behaviors[this.currentBehaviorIndex];

        if (!behaviorConfig) {
            console.warn('BossAIManager: Behavior index out of bounds');
            return;
        }

        // Exit current behavior
        if (this.currentBehavior) {
            this.currentBehavior.exit();
        }

        // Create new behavior
        this.currentBehavior = BehaviorFactory.create(
            behaviorConfig.key,
            this.boss,
            behaviorConfig.params || {}
        );

        if (this.currentBehavior) {
            this.currentBehavior.enter();
        }

        this.behaviorTimer = 0;

        console.debug('BOSS_BEHAVIOR_LOAD', {
            boss: this.boss.entity?.config?.key,
            phase: phase.id,
            behavior: behaviorConfig.key,
            duration: behaviorConfig.duration
        });
    }

    /**
     * Update the current behavior.
     */
    updateBehavior(delta) {
        if (!this.currentBehavior) return;

        this.behaviorTimer += delta;
        this.currentBehavior.update(delta);

        const phase = this.phases[this.currentPhaseIndex];
        const behaviorConfig = phase?.behaviors?.[this.currentBehaviorIndex];

        if (!behaviorConfig) return;

        // Check for behavior transition
        const shouldTransition =
            (behaviorConfig.duration && this.behaviorTimer >= behaviorConfig.duration) ||
            this.currentBehavior.isComplete();

        if (shouldTransition) {
            this.nextBehavior();
        }
    }

    /**
     * Advance to the next behavior in the sequence.
     */
    nextBehavior() {
        const phase = this.phases[this.currentPhaseIndex];
        if (!phase || !phase.behaviors) return;

        this.currentBehaviorIndex++;

        // Check if we've completed the sequence
        if (this.currentBehaviorIndex >= phase.behaviors.length) {
            if (phase.loop) {
                // Loop back to start
                this.currentBehaviorIndex = 0;
            } else {
                // Stay on last behavior
                this.currentBehaviorIndex = phase.behaviors.length - 1;
                return;
            }
        }

        this.loadBehavior();
    }

    /**
     * Get the movement vector from the current behavior.
     */
    getMovementVector() {
        if (!this.currentBehavior) {
            return { x: 0, y: 0, speed: 0 };
        }
        return this.currentBehavior.getMovementVector();
    }

    /**
     * Get the current phase.
     */
    getCurrentPhase() {
        return this.phases[this.currentPhaseIndex];
    }

    /**
     * Get the current behavior.
     */
    getCurrentBehavior() {
        return this.currentBehavior;
    }

    /**
     * Get debug info about current state.
     */
    getDebugInfo() {
        const phase = this.getCurrentPhase();
        return {
            phase: phase?.id || phase?.name || this.currentPhaseIndex,
            behavior: this.currentBehavior?.constructor.name || 'none',
            behaviorState: this.currentBehavior?.getState() || 'none',
            behaviorTimer: this.behaviorTimer,
            healthPercent: (this.boss.health / this.boss.maxHealth * 100).toFixed(1) + '%'
        };
    }

    /**
     * Cleanup when boss is destroyed.
     */
    destroy() {
        if (this.currentBehavior) {
            this.currentBehavior.exit();
            this.currentBehavior = null;
        }
    }
}
