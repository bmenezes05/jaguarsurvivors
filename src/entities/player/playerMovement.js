export class PlayerMovement {
    constructor(scene, container, stats, config) {
        this.container = container;
        this.stats = stats;
        this.config = config;
        this.isMoving = false;
        this.facingRight = true;

        scene.physics.add.existing(container);
        this.body = container.body;

        this.body.setSize(config.bodyWidth || 60, config.bodyHeight || 130);
        this.body.setOffset(-(config.bodyWidth || 60) / 2, -(config.bodyHeight || 130) / 2);
        this.body.setDrag(config.friction || 800);
        this.body.setCollideWorldBounds(true);

        this.moveVector = new Phaser.Math.Vector2();
    }

    update(cursors, wasd, delta) {
        const x = (cursors.left.isDown || wasd.left.isDown ? -1 : 0)
            + (cursors.right.isDown || wasd.right.isDown ? 1 : 0);
        const y = (cursors.up.isDown || wasd.up.isDown ? -1 : 0)
            + (cursors.down.isDown || wasd.down.isDown ? 1 : 0);

        if (x || y) {
            this.body.setMaxVelocity(this.stats.moveSpeed);
            this.moveVector.set(x, y).normalize().scale(this.config.acceleration || 2000);
            this.body.setAcceleration(this.moveVector.x, this.moveVector.y);
            this.isMoving = true;

            if (x !== 0) {
                this.facingRight = x > 0;
                this.container.setScale(this.facingRight ? 1 : -1, 1);

                // Correção do Hitbox: Inverte o offset horizontal conforme a direção
                const bodyWidth = this.config.bodyWidth || 60;
                const bodyHeight = this.config.bodyHeight || 130;
                const offsetX = this.facingRight ? (-bodyWidth / 2) : (bodyWidth / 2);
                this.body.setOffset(offsetX, -bodyHeight / 2);
            }
        } else {
            this.body.setAcceleration(0, 0);
            this.isMoving = false;
        }
    }
}
