import { VFX_CONFIG } from './vfxConfig.js';
import { ObjectPool } from '../objectPool.js';

export class VFXManager {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;
        this.activeEffects = [];
        this.pools = new Map(); // Pool per EffectClass

        // Initialize
        this.registerEvents();
        console.debug('[vfxManager] System initialized');
    }

    /**
     * Subscribe to all events defined in the configuration.
     */
    registerEvents() {
        Object.keys(VFX_CONFIG).forEach(eventName => {
            this.events.on(eventName, (arg1, arg2, arg3, arg4) => {
                // Normalize payloads based on event type if needed, 
                // but for now we pass the loose arguments to a handler helper
                this.handleEvent(eventName, arg1, arg2, arg3, arg4);
            });
        });
    }

    /**
     * Process an event and trigger matching effects.
     */
    handleEvent(eventName, ...args) {
        const configs = VFX_CONFIG[eventName];
        if (!configs) return;

        console.debug(`[VFX] Handling Event: ${eventName}`, args);

        // Parse context from args (heuristic or specific per event)
        // Since args vary by event, we need a way to standardize context or pass all args.
        // For simplicity/decoupling, we assume strict contracts or pass raw args to condition/effect.
        // However, existing events have varied signatures (e.g. enemy-damaged(enemy, amount, isCrit)).
        // We construct a 'context' object.
        const context = this.createContext(eventName, args);

        configs.forEach(configEntry => {
            // Check condition
            if (configEntry.condition && !configEntry.condition(context)) {
                return;
            }

            // Create and start effect
            this.playEffect(configEntry.effectClass, configEntry.config, context);
        });
    }

    /**
     * Normalize event arguments into a usable context object.
     * This acts as an adapter layer for existing legacy events.
     */
    createContext(eventName, args) {
        const context = { rawArgs: args };

        switch (eventName) {
            case 'enemy-damaged':
                // args: [enemy, amount, isCritical, attacker]
                context.target = args[0];
                context.amount = args[1];
                context.isCritical = args[2];
                // Resolve position from target
                if (context.target) {
                    context.x = context.target.x;
                    context.y = context.target.y;
                }
                break;
            case 'status-applied':
                // args: [enemy, type]
                context.target = args[0];
                context.type = args[1];
                if (context.target) {
                    context.x = context.target.x;
                    context.y = context.target.y;
                }
                break;
            case 'boss-died':
                // args: [x, y] - inferred from GameEventHandler registerBossEvents usage
                context.x = args[0];
                context.y = args[1];
                break;
            case 'player-damaged':
                if (this.scene.player) {
                    context.x = this.scene.player.x;
                    context.y = this.scene.player.y;
                }
                break;
            case 'structure-damaged':
                // args: [structure, amount, isCritical]
                context.target = args[0];
                context.amount = args[1];
                context.isCritical = args[2];
                if (context.target) {
                    context.x = context.target.x;
                    context.y = context.target.y;
                }
                break;
            case 'structure-destroyed':
            case 'structure-spawned':
                // args: [structure]
                context.target = args[0];
                if (context.target) {
                    context.x = context.target.x;
                    context.y = context.target.y;
                }
                break;
            case 'pickup-collected':
                // args: [pickup]
                context.target = args[0];
                if (context.target) {
                    context.type = context.target.type;
                    context.x = context.target.x;
                    context.y = context.target.y;
                }
                break;
            default:
                // Fallback: try to find x/y in first arg if it's an object
                if (args[0] && typeof args[0].x === 'number') {
                    context.x = args[0].x;
                    context.y = args[0].y;
                }
                break;
        }
        return context;
    }

    /**
     * Instantiates and starts the effect.
     */
    playEffect(EffectClass, config, context) {
        if (!EffectClass) return;

        let pool = this.pools.get(EffectClass);
        if (!pool) {
            pool = new ObjectPool(this.scene, EffectClass, 5);
            this.pools.set(EffectClass, pool);
        }

        // Get effect from pool (this handles creation or reuse)
        // Note: ObjectPool.get calls .reset(config) if available
        const effect = pool.get(config);

        // Assign pool reference so effect can return itself
        effect.pool = pool;

        // Safety check for coordinates
        const x = context.x || 0;
        const y = context.y || 0;

        effect.start(x, y, context);
    }
}
