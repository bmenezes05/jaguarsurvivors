import { ObjectPool } from './objectPool.js';
import { Pickup } from '../entities/pickup.js';

export class PickupManager {
    constructor(scene) {
        this.scene = scene;

        // Group for physics collisions
        this.group = this.scene.physics.add.group();

        // Pool for performance
        this.pool = new ObjectPool(scene, Pickup, 20);

        // Tracking active pickups for cleanup/pooling
        this.activePickups = [];
    }

    spawn(x, y, type) {
        // Validation: Clamp to world bounds
        let spawnX = x;
        let spawnY = y;
        if (this.scene.world && typeof this.scene.world.clampPosition === 'function') {
            const clamped = this.scene.world.clampPosition(x, y, 30); // Margin for items
            spawnX = clamped.x;
            spawnY = clamped.y;
        }

        if (this.scene.telegraphManager) {
            this.scene.telegraphManager.showTelegraph(spawnX, spawnY, 'item', () => {
                this._spawnActual(spawnX, spawnY, type);
            });
        } else {
            this._spawnActual(spawnX, spawnY, type);
        }
    }

    _spawnActual(x, y, type) {
        // Safety check
        if (!this.scene.sys.isActive()) return;

        const pickup = this.pool.get({ x, y, type });
        this.activePickups.push(pickup);

        if (!this.group.contains(pickup)) {
            this.group.add(pickup);
        }
    }

    update() {
        // Return collected/inactive pickups to the pool
        for (let i = this.activePickups.length - 1; i >= 0; i--) {
            const pickup = this.activePickups[i];

            // If it's been collected, wait for it to become invisible (post-animation)
            if (!pickup.isActive && !pickup.visible) {
                this.group.remove(pickup);
                this.pool.release(pickup);
                this.activePickups.splice(i, 1);
            }
        }
    }
    destroy() {
        this.activePickups = [];
        if (this.pool) this.pool.clear();
        if (this.group) this.group.destroy(true);
    }
}
