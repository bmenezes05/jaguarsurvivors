export class EnemyView {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;

        this.container = scene.add.container(0, 0);
        scene.physics.world.enable(this.container);
        this.container.setData('parent', enemy);

        this.sprite = scene.add.image(0, 0, null);
        this.leftLeg = scene.add.image(0, 0, null);
        this.rightLeg = scene.add.image(0, 0, null);

        this.container.add([this.leftLeg, this.rightLeg, this.sprite]);

        // Store body dimensions for hitbox correction
        this.bodyWidth = 60;
        this.bodyHeight = 100;

        // Animation State
        this.animTimer = 0;
    }

    spawn(x, y, config) {
        this.container.setPosition(x, y);
        this.container.setVisible(true);
        this.container.setActive(true);
        this.container.body.enable = true;

        const tex = config.textureKey || config.key;
        this.sprite.setTexture(tex);
        this.leftLeg.setTexture(tex + '_legs');
        this.rightLeg.setTexture(tex + '_legs');

        // Apply Scaling
        const bodyScale = config.bodyScale || 1.0;
        const legsScale = config.legsScale || 1.0;
        this.sprite.setScale(bodyScale);
        this.leftLeg.setScale(legsScale);
        this.rightLeg.setScale(legsScale);

        // Standardize Origin to Top Center for proper rotation (hips)
        this.leftLeg.setOrigin(0.5, 0);
        this.rightLeg.setOrigin(0.5, 0);

        // Apply Leg Offsets
        // Use legOffset for positioning the hips relative to body center
        const legOffset = config.legOffset || { x: 0, y: 0 };
        this.leftLeg.setPosition(legOffset.x - 5, legOffset.y);
        this.rightLeg.setPosition(legOffset.x + 5, legOffset.y);

        // Reset rotation
        this.leftLeg.setRotation(0);
        this.rightLeg.setRotation(0);

        this.sprite.setPosition(0, 0);

        // Set body size
        const hitbox = config.hitbox || { width: config.bodyWidth || 60, height: config.bodyHeight || 100 };
        this.bodyWidth = hitbox.width;
        this.bodyHeight = hitbox.height;
        this.container.body.setSize(this.bodyWidth, this.bodyHeight);
        this.container.body.setOffset(-this.bodyWidth / 2, -this.bodyHeight / 2);

        this.container.setScale(1, 1);
        this.setFacing(true);

        this.animTimer = Math.random() * 1000; // Random offset
    }

    update(delta, isMoving) {
        if (isMoving) {
            // Animation logic (swing legs)
            // Speed of swing: 0.015 per ms
            this.animTimer += delta * 0.015;

            // Amplitude: 0.2 rad ~= 11 degrees
            const sway = Math.sin(this.animTimer) * 0.2;

            this.leftLeg.setRotation(sway);
            this.rightLeg.setRotation(-sway);
        } else {
            // Return to neutral
            this.leftLeg.setRotation(0);
            this.rightLeg.setRotation(0);
        }
    }

    setFacing(isRight) {
        // Use 1 or -1 based on base scale, do not read current scaleX to avoid accumulation errors
        const dir = isRight ? 1 : -1;
        this.container.setScale(dir, 1);

        const newOffsetX = isRight ? (-this.bodyWidth / 2) : (this.bodyWidth / 2);
        this.container.body.setOffset(newOffsetX, -this.bodyHeight / 2);
    }

    // Tinting is now handled by VFXManager iterating over the container children
    // to keep visual logic decoupled from the Entity View.

    destroy() {
        this.container.setVisible(false);
        if (this.container.body) {
            this.container.body.enable = false;
        }
    }

    get x() { return this.container.x; }
    get y() { return this.container.y; }
}
