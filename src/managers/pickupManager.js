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
            if (!pickup.isActive) {
                // If it's been collected and finished its animation
                if (pickup.alpha === 0 || !pickup.visible) {
                    this.group.remove(pickup);
                    this.pool.release(pickup);
                    this.activePickups.splice(i, 1);
                }
            }
        }
    }
}
