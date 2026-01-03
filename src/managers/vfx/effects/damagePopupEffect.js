import { BaseVFXEffect } from './baseVFXEffect.js';

export class DamagePopupEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        // Requires usage of Scene's damageTextPool via a helper or direct access
        // Ideally VFX config passes the text/color

        const amount = context.amount || 0;
        const xPos = x;
        const yPos = y;
        const color = this.config.color || '#FFFFFF'; // Default white
        const scale = this.config.scale || 1.0;

        // This relies on the scene exposing showDamagePopup or similar API
        // In GameEventHandler it called: this.scene.showDamagePopup(...)

        if (this.scene.showDamagePopup) {
            this.scene.showDamagePopup(xPos, yPos, amount, color, scale, context.isCritical);
        }

        this.complete();
    }
}
