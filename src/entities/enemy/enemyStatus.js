export class EnemyStatus {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.effects = new Map();
    }

    reset() {
        this.effects.clear();
    }

    apply(type, config) {
        this.effects.set(type, { ...config });
        this.updateVisuals();
    }

    update(delta) {
        for (const [type, effect] of this.effects) {
            effect.duration -= delta;
            if (effect.duration <= 0) {
                this.effects.delete(type);
                this.updateVisuals();
            }
        }
    }

    updateVisuals() {
        this.enemy.view.clearTint();
        if (this.effects.has('freeze')) this.enemy.view.setTint(0x00FFFF);
        if (this.effects.has('burn')) this.enemy.view.setTint(0xFF4500);
    }
}
