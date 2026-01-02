import { CONFIG } from '../config/config.js';

class Telegraph extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene, { x: 0, y: 0 });
        this.scene = scene;
        this.isActive = false;

        // Add to scene display list and update list
        scene.add.existing(this);
        this.setDepth(5); // Ensure it's above ground but below entities (usually entities are depth sorted by y)
        // Actually, floor is depth -1 or -2. Entities are 0+. 5 might be too high if it should be "on ground".
        // Let's try depth 1 or 0, or maybe logic to sort.
        // Requirement: "Clearly visible on the ground"
        this.setDepth(1);
    }

    activate(x, y, config, onComplete) {
        this.isActive = true;
        this.x = x;
        this.y = y;
        this.config = config;
        this.onComplete = onComplete;

        this.clear();
        this.visible = true;

        // Draw based on type/config
        const color = config.color !== undefined ? config.color : 0xFF0000;
        const radius = config.radius || 30;
        const alpha = config.alpha !== undefined ? config.alpha : 0.5;
        const shape = config.shape || 'circle';

        // Visuals: Fill + Stroke for better visibility
        this.fillStyle(color, alpha);
        this.lineStyle(2, color, 1.0); // Full alpha outline

        if (shape === 'square') {
            this.fillRect(-radius, -radius, radius * 2, radius * 2);
            this.strokeRect(-radius, -radius, radius * 2, radius * 2);
        } else if (shape === 'ring') {
            this.strokeCircle(0, 0, radius);
        } else {
            // Default: Circle
            this.fillCircle(0, 0, radius);
            this.strokeCircle(0, 0, radius);
        }

        // Animation State
        this.setScale(CONFIG.telegraph.defaults.startScale);
        this.alpha = alpha;

        // Main Growth Tween (Timing)
        if (this.mainTween) this.mainTween.remove();

        this.mainTween = this.scene.tweens.add({
            targets: this,
            scale: CONFIG.telegraph.defaults.endScale,
            duration: config.duration,
            ease: 'Cubic.out',
            onUpdate: (tween) => {
                // Increase pulse speed as we approach completion
                const progress = tween.progress; // 0 to 1
                const speedMult = 1 + (progress * 2); // 1x to 3x speed
                if (this.pulseTween) {
                    this.pulseTween.timeScale = speedMult;
                }
            },
            onComplete: () => {
                this.complete();
            }
        });

        // Pulse/Fade Effect (Visual Urgency)
        if (this.pulseTween) this.pulseTween.remove();

        this.pulseTween = this.scene.tweens.add({
            targets: this,
            alpha: { from: alpha, to: alpha * 0.3 },
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    complete() {
        // Guard against double completion or early cancellation
        if (!this.isActive) return;

        const callback = this.onComplete;
        this.deactivate(); // Cleanup visuals first

        if (callback) {
            callback();
        }
    }

    deactivate() {
        this.isActive = false;
        this.clear();
        this.visible = false;
        this.onComplete = null;

        if (this.mainTween) {
            this.mainTween.remove();
            this.mainTween = null;
        }
        if (this.pulseTween) {
            this.pulseTween.remove();
            this.pulseTween = null;
        }
    }

    destroy() {
        this.deactivate();
        super.destroy();
    }
}

export class TelegraphManager {
    constructor(scene) {
        this.scene = scene;
        this.pool = [];
        this.activeTelegraphs = [];

        // Pre-warm pool
        this.createPool(10);
    }

    createPool(size) {
        for (let i = 0; i < size; i++) {
            const t = new Telegraph(this.scene);
            t.visible = false;
            this.pool.push(t);
        }
    }

    getTelegraph() {
        let t = this.pool.find(t => !t.isActive);
        if (!t) {
            t = new Telegraph(this.scene);
            this.pool.push(t);
        }
        return t;
    }

    /**
     * Requests a telegraph visual followed by a spawn callback.
     * @param {number} x
     * @param {number} y
     * @param {string} type - 'enemy', 'item', 'structure'
     * @param {function} onSpawn - Callback when telegraph finishes (spawn happens here)
     * @param {object} [options] - Optional overrides 
     */
    showTelegraph(x, y, type, onSpawn, options = {}) {
        const typeConfig = CONFIG.telegraph.types[type] || CONFIG.telegraph.types.enemy;
        const duration = options.duration || CONFIG.telegraph.defaults.duration;

        const config = {
            ...typeConfig,
            duration: duration,
            ...options
        };

        const telegraph = this.getTelegraph();
        telegraph.activate(x, y, config, onSpawn);

        if (!this.activeTelegraphs.includes(telegraph)) {
            this.activeTelegraphs.push(telegraph);
        }
    }

    reset() {
        this.activeTelegraphs.forEach(t => t.deactivate());
        this.activeTelegraphs = [];
    }

    destroy() {
        this.pool.forEach(t => t.destroy());
        this.pool = [];
        this.activeTelegraphs = [];
    }
}
