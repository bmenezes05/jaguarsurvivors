/**
 * Boss Phase Configuration
 * 
 * Defines behavior phases and sequences for each boss type.
 * Bosses use BossAIManager to orchestrate these phases.
 * 
 * Phase structure:
 * - id: Unique identifier for the phase
 * - name: Human-readable name (for debugging/UI)
 * - trigger: Condition that activates this phase
 *   - type: 'health' | 'time' | 'immediate'
 *   - value: Threshold value (health percent 0-1, time in ms)
 * - behaviors: Array of behaviors to execute in sequence
 *   - key: Behavior type key (from BehaviorFactory)
 *   - duration: How long to run this behavior (ms)
 *   - params: Parameters for the behavior
 * - loop: If true, repeat the behavior sequence
 * - onEnter: Event to emit when phase starts
 * - onExit: Event to emit when phase ends
 */
export const bossPhaseConfig = {
    // ==================== BOSS: TIA DO ZAP ====================
    boss_tia_do_zap: {
        phases: [
            {
                id: 'phase1_aggressive',
                name: 'Aggressive Chase',
                trigger: { type: 'immediate' },
                behaviors: [
                    {
                        key: 'burst_pursuit',
                        duration: 4000,
                        params: {
                            pursuitSpeed: 1.5,
                            pursuitDuration: 2000,
                            pauseDuration: 800,
                            pauseSpeed: 0.2
                        }
                    },
                    {
                        key: 'chase',
                        duration: 2000,
                        params: {
                            speed: 1.0,
                            trackingSpeed: 0.8
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-phase-start'
            },
            {
                id: 'phase2_enraged',
                name: 'Enraged',
                trigger: { type: 'health', value: 0.5 },
                behaviors: [
                    {
                        key: 'charge',
                        duration: 3000,
                        params: {
                            chargeUpTime: 600,
                            chargeSpeed: 3.5,
                            chargeDuration: 400,
                            cooldownTime: 800,
                            idleSpeed: 0.5
                        }
                    },
                    {
                        key: 'burst_pursuit',
                        duration: 3000,
                        params: {
                            pursuitSpeed: 2.0,
                            pursuitDuration: 1500,
                            pauseDuration: 500,
                            pauseSpeed: 0.3
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-enrage'
            },
            {
                id: 'phase3_desperate',
                name: 'Desperate',
                trigger: { type: 'health', value: 0.2 },
                behaviors: [
                    {
                        key: 'zigzag',
                        duration: 2000,
                        params: {
                            baseSpeed: 2.0,
                            amplitude: 80,
                            frequency: 5.0
                        }
                    },
                    {
                        key: 'charge',
                        duration: 2500,
                        params: {
                            chargeUpTime: 400,
                            chargeSpeed: 4.0,
                            chargeDuration: 500,
                            cooldownTime: 500,
                            idleSpeed: 0.3
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-desperate'
            }
        ]
    },
    // ==================== BOSS: TIA ZAP (Variant) ====================
    boss_tia_zap: {
        phases: [
            {
                id: 'phase1_stalking',
                name: 'Stalking',
                trigger: { type: 'immediate' },
                behaviors: [
                    {
                        key: 'chase',
                        duration: 3000,
                        params: {
                            speed: 0.8,
                            trackingSpeed: 0.6
                        }
                    },
                    {
                        key: 'charge',
                        duration: 3500,
                        params: {
                            chargeUpTime: 1000,
                            chargeSpeed: 2.5,
                            chargeDuration: 600,
                            cooldownTime: 1200,
                            idleSpeed: 0.3
                        }
                    }
                ],
                loop: true
            },
            {
                id: 'phase2_aggressive',
                name: 'Aggressive',
                trigger: { type: 'health', value: 0.6 },
                behaviors: [
                    {
                        key: 'burst_pursuit',
                        duration: 4000,
                        params: {
                            pursuitSpeed: 1.8,
                            pursuitDuration: 2000,
                            pauseDuration: 600
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-enrage'
            },
            {
                id: 'phase3_berserk',
                name: 'Berserk',
                trigger: { type: 'health', value: 0.25 },
                behaviors: [
                    {
                        key: 'charge',
                        duration: 6000,
                        params: {
                            chargeUpTime: 300,
                            chargeSpeed: 4.0,
                            chargeDuration: 400,
                            cooldownTime: 400,
                            idleSpeed: 0.2
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-berserk'
            }
        ]
    },
    // ==================== BOSS: KARL MARX ====================
    boss_karl_marx: {
        phases: [
            {
                id: 'phase1_methodical',
                name: 'Methodical Approach',
                trigger: { type: 'immediate' },
                behaviors: [
                    {
                        key: 'zigzag',
                        duration: 4000,
                        params: {
                            baseSpeed: 0.7,
                            amplitude: 60,
                            frequency: 2.0
                        }
                    },
                    {
                        key: 'chase',
                        duration: 2000,
                        params: {
                            speed: 0.9,
                            trackingSpeed: 1.0
                        }
                    }
                ],
                loop: true
            },
            {
                id: 'phase2_revolution',
                name: 'Revolutionary Fervor',
                trigger: { type: 'health', value: 0.5 },
                behaviors: [
                    {
                        key: 'burst_pursuit',
                        duration: 5000,
                        params: {
                            pursuitSpeed: 1.6,
                            pursuitDuration: 2500,
                            pauseDuration: 1000,
                            pauseSpeed: 0.2
                        }
                    },
                    {
                        key: 'zigzag',
                        duration: 3000,
                        params: {
                            baseSpeed: 1.2,
                            amplitude: 80,
                            frequency: 3.0
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-enrage'
            },
            {
                id: 'phase3_final_stand',
                name: 'Final Stand',
                trigger: { type: 'health', value: 0.15 },
                behaviors: [
                    {
                        key: 'charge',
                        duration: 2000,
                        params: {
                            chargeUpTime: 500,
                            chargeSpeed: 3.0,
                            chargeDuration: 500,
                            cooldownTime: 600
                        }
                    },
                    {
                        key: 'burst_pursuit',
                        duration: 2000,
                        params: {
                            pursuitSpeed: 2.5,
                            pursuitDuration: 1500,
                            pauseDuration: 300
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-desperate'
            }
        ]
    },
    // ==================== BOSS: BANDIDO MOTO ====================
    boss_bandido_moto: {
        phases: [
            {
                id: 'phase1_drive_by',
                name: 'Drive-By',
                trigger: { type: 'immediate' },
                behaviors: [
                    {
                        key: 'charge',
                        duration: 3000,
                        params: {
                            chargeUpTime: 600,
                            chargeSpeed: 2.5,
                            chargeDuration: 600,
                            cooldownTime: 1500,
                            idleSpeed: 0,
                            lockDirection: true
                        }
                    }
                ],
                loop: true
            }
        ]
    },
    // ==================== DEFAULT BOSS PHASES ====================
    // Used for bosses without specific phase configuration
    default: {
        phases: [
            {
                id: 'phase1_normal',
                name: 'Normal',
                trigger: { type: 'immediate' },
                behaviors: [
                    {
                        key: 'chase',
                        duration: 3000,
                        params: { speed: 1.0 }
                    },
                    {
                        key: 'burst_pursuit',
                        duration: 4000,
                        params: {
                            pursuitSpeed: 1.5,
                            pursuitDuration: 2000,
                            pauseDuration: 1000
                        }
                    }
                ],
                loop: true
            },
            {
                id: 'phase2_enraged',
                name: 'Enraged',
                trigger: { type: 'health', value: 0.5 },
                behaviors: [
                    {
                        key: 'charge',
                        duration: 3000,
                        params: {
                            chargeUpTime: 600,
                            chargeSpeed: 2.5,
                            chargeDuration: 500,
                            cooldownTime: 1000
                        }
                    },
                    {
                        key: 'burst_pursuit',
                        duration: 3000,
                        params: {
                            pursuitSpeed: 2.0,
                            pursuitDuration: 1500,
                            pauseDuration: 500
                        }
                    }
                ],
                loop: true,
                onEnter: 'boss-enrage'
            }
        ]
    }
};