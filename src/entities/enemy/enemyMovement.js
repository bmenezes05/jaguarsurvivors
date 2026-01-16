export class EnemyMovement {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.knockbackTimer = 0;
    }

    reset() {
        this.knockbackTimer = 0;
        this.enemy.view.container.body.setVelocity(0, 0);
    }

    /**
     * Apply movement vector to the enemy.
     * @param {Object} vector - { x, y, speed } from AI behavior
     * @param {number} delta - Time delta
     */
    move(vector, delta) {
        // Handle knockback priority
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= delta;
            this._applySafetyClamp();
            return;
        }

        // Stop if no vector
        if (!vector) {
            this.enemy.view.container.body.setVelocity(0, 0);
            this._applySafetyClamp();
            return;
        }

        const { x, y, speed } = vector;

        // Get base speed from entity stats
        const baseSpeed = this.enemy.entity.speed || 100;
        const finalSpeed = baseSpeed * speed;

        this.enemy.view.container.body.setVelocity(
            x * finalSpeed,
            y * finalSpeed
        );

        // Visual flipping delegate
        this.updateFacing(x);

        this._applySafetyClamp();
    }

    _applySafetyClamp() {
        // Safety clamp: Ensure they don't walk or get pushed outside even if physics fails
        if (this.scene.world && typeof this.scene.world.clampPosition === 'function') {
            const pos = this.enemy.view.container;
            const clamped = this.scene.world.clampPosition(pos.x, pos.y, 10);
            if (clamped.x !== pos.x || clamped.y !== pos.y) {
                this.enemy.view.container.setPosition(clamped.x, clamped.y);
            }
        }
    }

    updateFacing(velocityX) {
        if (velocityX === 0) return;
        const facingRight = velocityX > 0;

        // Delegate visual flip to view
        if (this.enemy.view && this.enemy.view.setFacing) {
            this.enemy.view.setFacing(facingRight);
        }
    }

    applyKnockback(force, duration, angle) {
        if (!this.enemy.view.container || !this.enemy.view.container.body) return;

        this.knockbackTimer = duration;

        this.enemy.view.container.body.setVelocity(
            Math.cos(angle) * force,
            Math.sin(angle) * force
        );
    }

    get isMoving() {
        if (!this.enemy.view || !this.enemy.view.container || !this.enemy.view.container.body) return false;
        return this.enemy.view.container.body.velocity.lengthSq() > 10;
    }
}
