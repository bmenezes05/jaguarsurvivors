import { BaseVFXEffect } from './baseVFXEffect.js';

export class FlashEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        // config: target (implicit from context?), color, duration
        const target = context.target || (context.rawArgs && context.rawArgs[0]);

        // If target is a sprite/container or has a sprite property
        const sprite = (target && target.sprite) ? target.sprite : target;

        if (sprite && sprite.setTint && target?.activeEffects?.size === 0) {
            const duration = this.config.duration || 100;

            sprite.setTint(0xaa0000);
            this.scene.time.delayedCall(duration, () => {
                if (sprite && sprite.clearTint) {
                    sprite.clearTint();
                }
                this.complete();
            });
        } else {
            this.complete();
        }
    }
}
