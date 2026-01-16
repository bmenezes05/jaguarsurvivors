export class EnemyProjectile {
    constructor(scene, x, y, target, enemyConfig) {
        this.scene = scene;
        this.damage = enemyConfig.projectileDamage ?? 10;

        const color = enemyConfig.projectileColor ?? 0xff0000;
        const scale = enemyConfig.projectileScale ?? 1;

        this.sprite = scene.physics.add.image(x, y, 'projectile_enemy');
        this.sprite.setCircle(5);
        this.sprite.setScale(scale);
        this.sprite.setDepth(2000);
        this.sprite.setData('parent', this);
    }

    applyVelocity(target, enemyConfig) {
        if (!this.sprite || !this.sprite.body) return;

        const speed = enemyConfig.projectileSpeed ?? 200;
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y);

        this.sprite.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        this.sprite.rotation = angle + Math.PI / 2;

        // Lifetime
        this.scene.time.delayedCall(2000, () => {
            if (this.sprite?.active) this.destroy();
        });
    }

    destroy() {
        if (!this.sprite) return;
        this.sprite.destroy();
        this.sprite = null;
    }
}
