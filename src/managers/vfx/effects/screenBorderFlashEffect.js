import { BaseVFXEffect } from "./baseVFXEffect.js";

export class ScreenBorderFlashEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        const color = this.config.color || 0xff0000;
        const thickness = this.config.thickness || 10;
        const duration = this.config.duration || 200;

        const { width, height } = this.scene.cameras.main;
        const border = this.scene.add.graphics();
        border.lineStyle(thickness, color, 1);
        border.strokeRect(0, 0, width, height);
        border.setDepth(1000);

        this.scene.tweens.add({
            targets: border,
            alpha: 0,
            duration: duration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                border.destroy();
                this.complete();
            }
        });
    }
}
