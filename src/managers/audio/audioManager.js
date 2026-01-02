import { AUDIO_CONFIG } from './audioConfig.js';

export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;

        // Internal state for throttling and management
        this.lastPlayed = new Map(); // Map<string, number> (Key -> Timestamp)
        this.maxChannels = 16;       // Max concurrent sounds to avoid cacophony

        // Initialize
        this.init();
    }

    init() {
        console.debug('[AudioManager] Initializing Audio System');
        this.registerEvents();
    }

    /**
     * Subscribe to all events defined in audioConfig
     */
    registerEvents() {
        Object.keys(AUDIO_CONFIG).forEach(eventName => {
            this.events.on(eventName, (...args) => {
                this.handleEvent(eventName, args);
            });
        });
        console.debug(`[AudioManager] Listening to ${Object.keys(AUDIO_CONFIG).length} events.`);
    }

    /**
     * Process an incoming event
     * @param {string} eventName 
     * @param {Array} args 
     */
    handleEvent(eventName, args) {
        const configList = AUDIO_CONFIG[eventName];
        if (!configList) return;

        const context = this.createContext(eventName, args);

        configList.forEach(configEntry => {
            this.processSoundConfig(configEntry, context);
        });
    }

    /**
     * Normalize arguments into a structured context object
     * @param {string} eventName 
     * @param {Array} args 
     * @returns {object} context
     */
    createContext(eventName, args) {
        const context = { rawArgs: args, isCritical: false };

        // Common argument patterns based on existing system
        // Pattern 1: enemy-damaged (target, amount, isCrit, source)
        if (eventName === 'enemy-damaged' && args.length >= 1) {
            context.target = args[0];
            context.amount = args[1];
            context.isCritical = args[2];
            context.source = args[3];
        }
        // Pattern 2: pickup-collected (pickupInstance) or (type)
        else if (eventName === 'pickup-collected') {
            if (args[0] && typeof args[0] === 'object') {
                context.pickup = args[0];
                context.type = args[0].type || 'unknown';
            } else if (typeof args[0] === 'string') {
                context.type = args[0];
            }
        }
        // Pattern 3: Generic object passed as first arg
        else if (args[0] && typeof args[0] === 'object') {
            Object.assign(context, args[0]);
        }

        // Structure events mapping
        if (eventName === 'structure-damaged') {
            // args: [structure, amount, isCritical]
            context.target = args[0];
            context.amount = args[1];
            context.isCritical = args[2];
        } else if (eventName === 'structure-destroyed') {
            context.target = args[0];
        }

        return context;
    }

    /**
     * logic for playing a sound based on configuration configEntry
     */
    processSoundConfig(entry, context) {
        // 1. Check Condition
        if (entry.condition && !entry.condition(context)) {
            return;
        }

        // 2. Resolve Sound Key (Variations)
        let key = entry.key;
        if (entry.keys && entry.keys.length > 0) {
            key = Phaser.Math.RND.pick(entry.keys);
        }

        // 3. Validation
        if (!this.validateAsset(key)) return;

        // 4. Check Chance
        if (entry.chance !== undefined && Math.random() > entry.chance) {
            return;
        }

        // 5. Throttling
        if (this.isThrottled(key, entry.throttle)) {
            return;
        }

        // 6. Priority / Channel Check
        const priority = entry.priority || 50;
        if (!this.requestChannel(priority)) {
            // Channel saturated and sound is low priority
            return;
        }

        // 7. Play
        this.playContextual(key, entry.config, priority);
    }

    /**
     * Check if sound should be skipped due to throttling
     */
    isThrottled(key, throttleMs) {
        if (!throttleMs) return false;

        const now = Date.now();
        const last = this.lastPlayed.get(key) || 0;

        if (now - last < throttleMs) {
            return true;
        }

        this.lastPlayed.set(key, now); // Update happens on play?
        // Actually, if we return false here, we MIGHT play. 
        // But if we fail channel check later, we updated throttle for nothing?
        // Better to update timestamp only on ACTUAL play.
        // HOWEVER, to prevent logic spam, we can treat "attempt" as activity.
        // Let's reset the map entry only if we actually play.
        // Refactoring: move set() to playContextual.
        return false;
    }

    validateAsset(key) {
        if (!key) return false;
        if (this.scene.cache.audio.exists(key)) return true;

        // Log once per session ideally, but debug is fine
        // console.debug(`[AudioManager] Missing Asset: ${key}`);
        return false;
    }

    requestChannel(priority) {
        const playing = this.scene.sound.getAllPlaying();

        // If we have free channels, go ahead
        if (playing.length < this.maxChannels) {
            return true;
        }

        // Find a candidate to stop (lowest priority)
        let lowestPriority = 999;
        let candidate = null;

        for (const snd of playing) {
            // Default 50 if generic sound unknown priority
            const p = (snd.priority !== undefined) ? snd.priority : 50;
            if (p < lowestPriority) {
                lowestPriority = p;
                candidate = snd;
            }
        }

        // If new sound is more important than the least important playing sound
        if (candidate && priority > lowestPriority) {
            // Cut off the weak sound
            candidate.stop();
            // candidate.destroy() happens via complete/stop event listeners usually?
            // Phaser sounds don't auto-destroy on stop unless configured?
            return true;
        }

        return false;
    }

    playContextual(key, config, priority) {
        // Update throttle here
        this.lastPlayed.set(key, Date.now());

        // Call internal low-level play
        this._playInternal(key, config, priority);
    }

    /**
     * Imperative Play (Legacy Support & Manual Calls)
     */
    play(key, config = {}) {
        // Default manual priority to High to ensure UI/Music works
        this._playInternal(key, config, 70);
    }

    _playInternal(key, config = {}, priority = 50) {
        try {
            // Ensure volume is clamped
            const volume = Phaser.Math.Clamp(config.volume !== undefined ? config.volume : 1.0, 0, 2);

            const soundConfig = {
                ...config,
                volume: volume
            };

            // We use .add() then .play() to hold the reference for priority management
            const sound = this.scene.sound.add(key, soundConfig);

            sound.priority = priority;

            // Cleanup on complete
            sound.once('complete', () => {
                sound.destroy();
            });

            sound.play();

            console.debug("EVENT_EMITTED", {
                event_name: "audio-played",
                payload: { key, priority, volume: soundConfig.volume }
            });

        } catch (err) {
            console.debug('[AudioManager] Error playing sound', err);
        }
    }

    stopAll() {
        if (this.scene && this.scene.sound) {
            this.scene.sound.stopAll();
        }
    }
}
