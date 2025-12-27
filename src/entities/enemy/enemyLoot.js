export class EnemyLoot {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
    }

    drop() {
        this.scene.kills++;

        if (Math.random() < this.enemy.entity.config.xpDropChance) {
            this.scene.xpSystem.dropXP(
                this.enemy.x,
                this.enemy.y,
                this.enemy.entity.config.xpValue
            );
        }
    }
}
