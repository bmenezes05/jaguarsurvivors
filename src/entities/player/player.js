import { PlayerStats } from './playerStats.js';
import { PlayerView } from './playerView.js';
import { PlayerMovement } from './playerMovement.js';

export class Player {
    constructor(scene, x, y, playerConfig) {
        this.scene = scene;
        this.config = playerConfig;

        this.stats = new PlayerStats(playerConfig);
        this.view = new PlayerView(scene, x, y, playerConfig);
        this.movement = new PlayerMovement(scene, this.view.container, this.stats, playerConfig);

        this._health = this.stats.maxHealth;
        this.isInvulnerable = false;
        this.invTimer = 0;
        this.regenTimer = 0;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });

        scene.cameras.main.startFollow(this.view.container);
    }

    update(delta) {
        this.movement.update(this.cursors, this.wasd, delta);
        this.view.update(delta, this.movement.isMoving);

        this._updateInvulnerability(delta);
        this._updateRegen(delta);
    }

    takeDamage(amount, attacker = null) {
        if (this.isInvulnerable) return;

        if (Math.random() < this.stats.evasion) {
            console.debug("EVENT_EMITTED", { eventName: 'player-evaded', payload: null });
            this.scene.events.emit('player-evaded');
            return;
        }

        if (this.stats.thorns > 0 && attacker?.takeDamage) {
            attacker.takeDamage(amount * this.stats.thorns);
        }

        this._health -= amount;
        this.isInvulnerable = true;
        this.invTimer = this.config.invulnerableTime || 500;

        console.debug("EVENT_EMITTED", { eventName: 'player-damaged', payload: amount });
        this.scene.events.emit('player-damaged', amount);
        console.debug("EVENT_EMITTED", { eventName: 'player-health-changed', payload: { health: this._health, maxHealth: this.stats.maxHealth } });
        this.scene.events.emit('player-health-changed', this._health, this.stats.maxHealth);

        if (this._health <= 0) {
            console.debug("EVENT_EMITTED", { eventName: 'player-died', payload: null });
            this.scene.events.emit('player-died');
        }
    }

    heal(amount) {
        if (amount <= 0 || this._health >= this.stats.maxHealth) return;
        this._health = Math.min(this._health + amount, this.stats.maxHealth);
        console.debug("EVENT_EMITTED", { eventName: 'player-health-changed', payload: { health: this._health, maxHealth: this.stats.maxHealth } });
        this.scene.events.emit('player-health-changed', this._health, this.stats.maxHealth);
    }

    _updateInvulnerability(delta) {
        if (!this.isInvulnerable) return;

        this.invTimer -= delta;
        this.view.setBlink(this.invTimer);

        if (this.invTimer <= 0) {
            this.isInvulnerable = false;
            this.view.clearBlink();
        }
    }

    _updateRegen(delta) {
        if (this.stats.hpRegen <= 0 || this._health >= this.stats.maxHealth) return;

        this.regenTimer += delta;
        if (this.regenTimer >= 1000) {
            this.regenTimer = 0;
            this.heal(this.stats.hpRegen);
        }
    }

    get x() { return this.view.container.x; }
    get y() { return this.view.container.y; }
    get health() { return this._health; }
    get weaponSprite() { return this.view.weapon; }
    get facingRight() { return this.movement.facingRight !== false; } // Default to true
    get active() { return this.view.container.active; }
}