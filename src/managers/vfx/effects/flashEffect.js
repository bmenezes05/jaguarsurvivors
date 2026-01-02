import { BaseVFXEffect } from './baseVFXEffect.js';

export class FlashEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        // config: target (implicit from context?), color, duration
        const target = context.target || (context.rawArgs && context.rawArgs[0]);

        // STRATEGY: 
        // 1. Try public interface (setTint) - Preferred for encapsulation if available.
        // 2. If container, iterate children and tint all Sprites/Images.
        // 3. If sprite, tint directly.

        const duration = this.config.duration || 100;
        const color = this.config.color;

        const targetsToTint = [];

        // helper to gather tintable objects
        const collectTintables = (obj) => {
            if (!obj) return;

            // 1. If it's a wrapper with a container property (e.g. Enemy class)
            if (obj.container && obj.container instanceof Phaser.GameObjects.Container) {
                collectTintables(obj.container);
                return;
            }

            // 2. If it's a container, recurse into children
            if (obj instanceof Phaser.GameObjects.Container) {
                obj.list.forEach(child => collectTintables(child));
            }
            // 3. Otherwise, if it's a tintable object (Sprite, Image, etc)
            else if (typeof obj.setTint === 'function') {
                targetsToTint.push(obj);
            }
        };

        collectTintables(target);

        if (targetsToTint.length > 0) {
            targetsToTint.forEach(t => {
                // If the color is solid white, setTint often does nothing (multiplicative).
                // setTintFill makes it a solid color flash which is better for hit effects.
                if (color === 0xFFFFFF || this.config.useFill) {
                    if (typeof t.setTintFill === 'function') {
                        t.setTintFill(color);
                    } else {
                        t.setTint(color);
                    }
                } else {
                    t.setTint(color);
                }
            });

            this.scene.time.delayedCall(duration, () => {
                targetsToTint.forEach(t => {
                    if (typeof t.clearTint === 'function') t.clearTint();
                });
                this.complete();
            });
        } else {
            this.complete();
        }
    }
}
