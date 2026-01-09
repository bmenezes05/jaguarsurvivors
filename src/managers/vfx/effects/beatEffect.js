import { BaseVFXEffect } from './baseVFXEffect.js';

/**
 * Creates a rhythmic pulse and shake effect on a target sprite.
 * Useful for speaker-like objects or objects that react to a beat.
 */
export class BeatEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        this.target = context.target;
        if (!this.target || !this.target.view) {
            this.complete();
            return;
        }

        const vfxConfig = this.target.config.vfx || {};
        const interval = vfxConfig.interval || 600;
        const shakeIntensity = vfxConfig.shakeIntensity || 3;
        const pulseScale = vfxConfig.pulseScale || 1.1;
        const duration = vfxConfig.duration || 200;

        // We want to animate the sprite within the container to avoid physics issues
        const sprite = this.target.view.sprite;
        if (!sprite) {
            this.complete();
            return;
        }

        // Keep track of original values to reset them
        this.originalSpriteX = sprite.x;
        this.originalSpriteY = sprite.y;
        this.originalScaleX = sprite.scaleX;
        this.originalScaleY = sprite.scaleY;

        this.beatTimer = this.scene.time.addEvent({
            delay: interval,
            callback: () => {
                // If structure is no longer active or destroyed, stop
                if (!this.target.isActive || !sprite.active) {
                    this.stop();
                    return;
                }

                this.triggerBeat(sprite, pulseScale, shakeIntensity, duration);
            },
            loop: true
        });

        // Also stop when the structure is destroyed (event-based fallback)
        this.scene.events.once('structure-destroyed', (destroyedStruct) => {
            if (destroyedStruct === this.target) {
                this.stop();
            }
        });
    }

    triggerBeat(sprite, pulseScale, shakeIntensity, duration) {
        this.scene.tweens.add({
            targets: sprite,
            scaleX: this.originalScaleX * pulseScale,
            scaleY: this.originalScaleY * pulseScale,
            duration: duration / 2,
            yoyo: true,
            ease: 'Quad.easeOut',
            onUpdate: () => {
                if (!sprite.active) return;
                // Shake relative to its original position in container
                sprite.x = this.originalSpriteX + (Math.random() - 0.5) * shakeIntensity;
                sprite.y = this.originalSpriteY + (Math.random() - 0.5) * shakeIntensity;
            },
            onComplete: () => {
                if (sprite.active) {
                    sprite.x = this.originalSpriteX;
                    sprite.y = this.originalSpriteY;
                    sprite.setScale(this.originalScaleX, this.originalScaleY);
                }
            }
        });
    }

    onStop() {
        if (this.beatTimer) {
            this.beatTimer.remove();
            this.beatTimer = null;
        }

        // Ensure sprite is reset
        const sprite = this.target ? this.target.view.sprite : null;
        if (sprite && sprite.active) {
            sprite.x = this.originalSpriteX;
            sprite.y = this.originalSpriteY;
            sprite.setScale(this.originalScaleX, this.originalScaleY);
        }

        this.complete();
    }
}
