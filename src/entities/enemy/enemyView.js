export class EnemyView {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;

        this.container = scene.add.container(0, 0);
        scene.physics.world.enable(this.container);
        this.container.setData('parent', enemy);

        this.shadow = scene.add.image(0, 0, 'shadow').setAlpha(0.5);
        this.sprite = scene.add.image(0, 0, null);
        this.leftLeg = scene.add.image(0, 0, null);
        this.rightLeg = scene.add.image(0, 0, null);

        this.container.add([this.shadow, this.leftLeg, this.rightLeg, this.sprite]);
    }

    spawn(x, y, config) {
        this.container.setPosition(x, y);
        this.sprite.setTexture(config.key);
        this.leftLeg.setTexture(config.key + '_legs');
        this.rightLeg.setTexture(config.key + '_legs');
    }

    setTint(color) {
        this.sprite.setTint(color);
    }

    clearTint() {
        this.sprite.clearTint();
    }

    destroy() {
        this.container.setVisible(false);
        this.container.body.enable = false;
    }

    get x() { return this.container.x; }
    get y() { return this.container.y; }
}
