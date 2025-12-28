import { CONFIG } from '../../config/config.js';

export class PlayerView {
    constructor(scene, x, y, config) {
        this.scene = scene;
        this.config = config;
        this.container = scene.add.container(x, y);
        this.walkTime = 0;

        // == LAYER ORDER ==
        // O Container Phaser desenha os itens na ordem do array 'list'.
        // Queremos: Sombra (trás) -> Pernas -> Arma -> Corpo (frente)

        // 1. Shadow
        const shadowY = config.bodyHeight ? (config.bodyHeight / 2) - 5 : 60;
        this.shadow = scene.add.image(0, shadowY, 'shadow').setAlpha(0.5).setScale(0.8, 0.4);

        // 2. Legs
        const legTex = config.key + '_legs';
        const legConfig = config.legs || { x: 0, y: 16, originX: 0.5, originY: 0 };

        this.leftLeg = scene.add.image(legConfig.x, legConfig.y, legTex)
            .setScale(config.legsScale || 0.3)
            .setOrigin(legConfig.originX, legConfig.originY);

        this.rightLeg = scene.add.image(-legConfig.x, legConfig.y, legTex)
            .setScale(config.legsScale || 0.3)
            .setOrigin(legConfig.originX, legConfig.originY);

        // 3. Body
        this.body = scene.add.image(0, config.bodyOffset || -10, config.key)
            .setScale(config.bodyScale || 0.4);

        // Adicionando explicitamente na ordem de renderização (Painters Algorithm)
        this.container.add([this.shadow, this.leftLeg, this.rightLeg, this.body]);
    }

    update(delta, isMoving) {
        if (isMoving) {
            this.animateLegs(delta);
        } else {
            this.resetLegs();
        }
    }

    animateLegs(delta) {
        const anim = this.config.animation || {};
        const swingSpeed = anim.walkSwingSpeed || 0.015;
        const swingAmp = anim.walkSwingAmplitude || 0.15;
        const bobSpeed = anim.walkBobSpeed || 0.02;
        const bobAmp = anim.walkBobAmplitude || 2;
        const baseY = this.config.legs?.y || 16;

        this.walkTime += delta;
        const timeFactor = this.walkTime;

        const swing = Math.sin(timeFactor * swingSpeed) * swingAmp;
        this.leftLeg.rotation = swing;
        this.rightLeg.rotation = -swing;

        const bob = Math.sin(timeFactor * bobSpeed) * bobAmp;
        this.leftLeg.y = baseY + bob;
        this.rightLeg.y = baseY + bob;
    }

    resetLegs() {
        const damping = this.config.animation?.restDamping || { rotation: 0.9, position: 0.2 };
        this.leftLeg.rotation *= damping.rotation;
        this.rightLeg.rotation *= damping.rotation;

        const baseY = this.config.legs?.y || 16;
        this.leftLeg.y = Phaser.Math.Linear(this.leftLeg.y, baseY, damping.position);
        this.rightLeg.y = Phaser.Math.Linear(this.rightLeg.y, baseY, damping.position);
    }

    setBlink(timer) {
        this.container.alpha = (Math.floor(timer / 100) % 2) ? 0.5 : 1;
    }

    clearBlink() {
        this.container.alpha = 1;
    }
}
