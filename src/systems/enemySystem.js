export class EnemySystem {
    constructor(scene, enemySpawner) {
        this.scene = scene;
        this.enemySpawner = enemySpawner;
        this.group = enemySpawner.getGroup();
    }

    /* ------------------------------------------------------------------ */
    /* ----------------------------- UPDATE ------------------------------ */
    /* ------------------------------------------------------------------ */

    update(time, delta) {
        if (!this.group) return;

        this.enemySpawner.update(delta);
        this.sortDepth();
    }

    sortDepth() {
        if (!this.group || !this.group.children || typeof this.group.children.iterate !== 'function') return;
        this.group.children.iterate(container => {
            if (!container || !container.active) return;
            container.setDepth(container.y);
        });
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------- GLOBAL OPERATIONS ----------------------- */
    /* ------------------------------------------------------------------ */

    strengthenEnemies(multiplier) {
        this.enemySpawner.getEnemies().forEach(enemy => {
            enemy.maxHp *= multiplier;
            enemy.hp *= multiplier;
            enemy.damage *= multiplier;
        });
    }

    killAllVisible() {
        this.enemySpawner.getEnemies().forEach(enemy => {
            enemy.takeDamage(999999, { silent: true });
        });
    }

    freezeAll(duration = 1000) {
        this.enemySpawner.getEnemies().forEach(enemy => {
            enemy.freeze(duration);
        });
    }
}
