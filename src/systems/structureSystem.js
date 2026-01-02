import { Structure } from '../entities/structure/structure.js';
import { CONFIG } from '../config/config.js';

export class StructureSystem {
    constructor(scene) {
        this.scene = scene;
        this.structures = [];
        this.pendingSpawns = []; // Tracks positions being telegraphed
        this.group = this.scene.physics.add.group();
    }

    init() {
        this.spawnInitialStructures();
    }

    spawnInitialStructures() {
        const { width, height } = CONFIG.world;
        const spawnConfig = CONFIG.structures.spawn;
        const density = spawnConfig.density;

        // Simple density calculation: area / (tileSize * factor) * density
        const area = width * height;
        const count = Math.floor((area / (128 * 128)) * density);

        console.debug(`[StructureSystem] Spawning ${count} structures...`);

        for (let i = 0; i < count; i++) {
            this.trySpawnRandomStructure(width, height, spawnConfig);
        }
    }

    trySpawnRandomStructure(worldW, worldH, spawnConfig) {
        const x = Phaser.Math.Between(0, worldW);
        const y = Phaser.Math.Between(0, worldH);

        // Check distance to player
        if (Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y) < spawnConfig.minPlayerDistance) {
            return;
        }

        // Check distance to active structures
        for (const struct of this.structures) {
            if (struct.isActive && Phaser.Math.Distance.Between(x, y, struct.x, struct.y) < spawnConfig.minDistance) {
                return;
            }
        }

        // Check distance to pending spawns (telegraphs)
        for (const pending of this.pendingSpawns) {
            if (Phaser.Math.Distance.Between(x, y, pending.x, pending.y) < spawnConfig.minDistance) {
                return;
            }
        }

        // Get allowed structures from current map config
        const mapConfig = this.scene.mapConfig || {};
        // fallback to all if not defined, or empty if we strictly want only map-defined
        const allowed = mapConfig.allowedStructures || Object.keys(CONFIG.structures.types);

        if (!allowed || allowed.length === 0) return;

        // Select random type
        const randomTypeKey = Phaser.Math.RND.pick(allowed);
        const config = CONFIG.structures.types[randomTypeKey];

        if (!config) return;

        this.spawn(x, y, config);
    }

    spawn(x, y, config) {
        if (this.scene.telegraphManager) {
            const pendingObj = { x, y };
            this.pendingSpawns.push(pendingObj);

            this.scene.telegraphManager.showTelegraph(x, y, 'structure', () => {
                // Remove from pending
                this.pendingSpawns = this.pendingSpawns.filter(p => p !== pendingObj);
                this._spawnActual(x, y, config);
            });
        } else {
            this._spawnActual(x, y, config);
        }
    }

    _spawnActual(x, y, config) {
        if (!this.scene.sys.isActive()) return;

        // Reuse or create new
        let structure = this.structures.find(s => !s.isActive);

        if (!structure) {
            structure = new Structure(this.scene);
            this.structures.push(structure);
            // DO NOT add to group here yet because container isn't created/initialized
        }

        // Spawn first to ensure container exists and is active
        structure.spawn(x, y, config);

        // Now safe to add to group if not already there
        if (!this.group.contains(structure.container)) {
            this.group.add(structure.container);
        }
    }

    update(time, delta) {
        if (!this.respawnTimer) this.respawnTimer = 0;
        this.respawnTimer += delta;

        const spawnConfig = CONFIG.structures.spawn;
        // Default interval 10s if not set
        const interval = spawnConfig.interval || 10000;

        if (this.respawnTimer >= interval) {
            this.respawnTimer = 0;

            // Check active count
            const activeCount = this.structures.filter(s => s.isActive).length;
            const { width, height } = CONFIG.world;
            const density = spawnConfig.density;
            const area = width * height;
            // Target count based on density
            const targetCount = Math.floor((area / (128 * 128)) * density);

            if (activeCount < targetCount) {
                console.debug(`[StructureSystem] Respawning structure. Active: ${activeCount}, Target: ${targetCount}`);
                // Try to spawn one
                this.trySpawnRandomStructure(width, height, spawnConfig);
            }
        }
    }
}
