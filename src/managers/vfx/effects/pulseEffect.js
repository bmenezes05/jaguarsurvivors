import { BaseVFXEffect } from './baseVFXEffect.js';

export class PulseEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        const target = context.target || (context.rawArgs && context.rawArgs[0]);
        // Pulse usually targets the container or sprite
        const objectToPulse = (target && target.container) ? target.container : target;

        if (objectToPulse && objectToPulse.setScale) {
            // Stop any existing pulse tweens on this object to prevent accumulation
            this.scene.tweens.killTweensOf(objectToPulse, ['scaleX', 'scaleY']);

            const scaleFactor = this.config.scale || 1.2;
            const duration = this.config.duration || 100;

            // Determine base scale. 
            // If it's an enemy container, we know magnitude should be 1.
            // For other objects, we might want to store it.
            // To be safe and generic: if it's already been modified, we might be in trouble.
            // However, killTweensOf above stops the movement.

            // RELIABLE FIX: Reset to magnitude 1 if it's a container (most common use case)
            // or use a 'baseScale' data property if available.
            let baseScaleX = objectToPulse.getData('baseScaleX');
            let baseScaleY = objectToPulse.getData('baseScaleY');

            if (baseScaleX === undefined || baseScaleX === null) {
                // First time pulsing, or no base scale stored.
                // Store current as base, but if it's a container we usually want 1.
                baseScaleX = objectToPulse.scaleX;
                baseScaleY = objectToPulse.scaleY;

                // If it looks like it's already scaled by a previous broken pulse, 
                // we can't easily recover here without more context, 
                // but killing tweens of helps for future pulses.
                objectToPulse.setData('baseScaleX', baseScaleX);
                objectToPulse.setData('baseScaleY', baseScaleY);
            }

            // Ensure we use the base scale for the tween start/end
            // Keep the current sign (for facing)
            const currentDirX = Math.sign(objectToPulse.scaleX) || 1;
            const currentDirY = Math.sign(objectToPulse.scaleY) || 1;

            const targetBaseX = Math.abs(baseScaleX) * currentDirX;
            const targetBaseY = Math.abs(baseScaleY) * currentDirY;

            this.scene.tweens.add({
                targets: objectToPulse,
                scaleX: targetBaseX * scaleFactor,
                scaleY: targetBaseY * scaleFactor,
                duration: duration / 2,
                yoyo: true,
                onComplete: () => {
                    // CRITICAL FIX: Only reset scale if the object is still active/visible.
                    // If it was a pickup that got collected, we don't want to bring it back!
                    if (objectToPulse && objectToPulse.setScale &&
                        (objectToPulse.active !== false) &&
                        (objectToPulse.visible !== false)) {
                        objectToPulse.setScale(targetBaseX, targetBaseY);
                    }
                    this.complete();
                }
            });
        } else {
            this.complete();
        }
    }
}
