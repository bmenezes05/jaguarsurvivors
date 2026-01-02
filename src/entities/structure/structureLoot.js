import { CONFIG } from '../../config/config.js';

export class StructureLoot {
    constructor(scene, structure) {
        this.scene = scene;
        this.structure = structure;
    }

    drop() {
        const config = this.structure.config;
        if (!config || !config.dropTable) return;

        const tableKey = config.dropTable;
        const dropTable = CONFIG.structures.dropTables[tableKey];

        if (!dropTable) {
            console.warn(`[StructureLoot] Drop table not found: ${tableKey}`);
            return;
        }

        // Weighted random selection
        const rand = Math.random();
        let currentWeight = 0;

        for (const item of dropTable) {
            currentWeight += item.chance;
            if (rand <= currentWeight) {
                this.spawnDrop(item);
                break;
            }
        }
    }

    spawnDrop(item) {
        const { x, y } = this.structure;

        switch (item.type) {
            case 'nothing':
                break;

            case 'xp_gem':
            case 'xp_gem_medium':
                if (this.scene.xpSystem) {
                    this.scene.xpSystem.dropXP(x, y, item.value || 10);
                }
                break;

            default:
                // Assume pickup type
                if (this.scene.pickupSystem) {
                    this.scene.pickupSystem.spawn(x, y, item.type);
                }
                break;
        }
    }
}
