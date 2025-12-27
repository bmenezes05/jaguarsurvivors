export class EnemyProjectile {
    constructor(scene, x, y, target, enemyConfig) {
        this.scene = scene;

        const angle = Math.atan2(target.y - y, target.x - x);
        const color = enemyConfig.projectileColor ?? 0xff0000;
        const scale = enemyConfig.projectileScale ?? 1;
        const speed = enemyConfig.projectileSpeed ?? 200;

        this.sprite = scene.physics.add.image(x, y, null);
        this.sprite.setCircle(5);
        this.sprite.setTint(color);
        this.sprite.setScale(scale);
        this.sprite.setDepth(2000);
        this.sprite.setData('parent', this);

        this.sprite.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        scene.time.delayedCall(2000, () => {
            if (this.sprite?.active) this.destroy();
        });

        scene.tweens.add({
            targets: this.sprite,
            angle: 360,
            duration: 1200,
            repeat: -1,
            ease: 'Linear'
        });
    }

    destroy() {
        if (!this.sprite) return;
        this.sprite.destroy();
        this.sprite = null;
    }
}
