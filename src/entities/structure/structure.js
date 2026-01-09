import { StructureView } from './structureView.js';
import { StructureLoot } from './structureLoot.js';

export class Structure {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;

        // Components
        this.view = new StructureView(scene, this);
        this.loot = new StructureLoot(scene, this);

        // State
        this.maxHp = 10;
        this.hp = 10;
        this.config = null;
    }

    spawn(x, y, config) {
        this.isActive = true;
        this.config = config;

        this.maxHp = config.maxHp || 10;
        this.hp = this.maxHp;

        this.view.spawn(x, y, config);
        this.scene.events.emit('structure-spawned', this);
    }

    takeDamage(amount, isCritical, attacker) {
        if (!this.isActive) return;

        this.hp -= amount;

        // Visual feedback
        this.view.flash();
        this.scene.events.emit('structure-damaged', this, amount, isCritical);

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        if (!this.isActive) return;
        this.isActive = false;

        this.scene.events.emit('structure-destroyed', this);

        // Drop loot
        this.loot.drop();

        // Visual death effect (optional, or handled by system listening to event)
        // For now, just remove.
        this.view.destroy();
    }

    get x() { return this.view.x; }
    get y() { return this.view.y; }
    get container() { return this.view.container; }
}
