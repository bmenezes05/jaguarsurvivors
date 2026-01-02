export class StructureView {
    constructor(scene, structure) {
        this.scene = scene;
        this.structure = structure;
        this.container = null;
        this.sprite = null;
    }

    spawn(x, y, config) {
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = this.scene.add.container(x, y);
            this.scene.physics.add.existing(this.container);
            this.container.body.setImmovable(true);
            this.container.body.pushable = false; // Prevent being pushed
        } else {
            this.container.setPosition(x, y);
            this.container.setActive(true);
            this.container.setVisible(true);
            this.container.body.enable = true;
        }

        // Link back for collision systems
        this.container.setData('parent', this.structure);
        this.container.setData('isStructure', true);

        // Visuals
        const key = config.spriteKey || 'pixel'; // Fallback
        if (this.sprite) this.sprite.destroy();

        this.sprite = this.scene.add.sprite(0, 0, key);
        this.sprite.setOrigin(0.5, 0.5);
        this.container.add(this.sprite);

        // Physics Body Size
        // Assuming square for now, or use texture size
        const width = this.sprite.width || 64;
        const height = this.sprite.height || 64;
        const scale = config.hitboxScale || 1.0;

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        this.container.body.setSize(scaledWidth, scaledHeight);
        this.container.body.setOffset(-scaledWidth / 2, -scaledHeight / 2); // Center body on container
    }

    flash() {
        if (this.sprite) {
            this.sprite.setTint(0xff0000);
            this.scene.time.delayedCall(100, () => {
                if (this.sprite && this.sprite.active) {
                    this.sprite.clearTint();
                }
            });
        }
    }

    destroy() {
        if (this.container) {
            this.container.setActive(false);
            this.container.setVisible(false);
            this.container.body.enable = false;
        }
    }

    get x() { return this.container ? this.container.x : 0; }
    get y() { return this.container ? this.container.y : 0; }
}
