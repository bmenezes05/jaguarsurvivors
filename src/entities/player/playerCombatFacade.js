export class PlayerCombatFacade {
    constructor(player) {
        this.player = player;
    }

    // === POSITION ===
    get x() { return this.player.x; }
    get y() { return this.player.y; }

    // === DIRECTION ===
    get facingRight() { return this.player.facingRight; }

    // === STATS ===
    get stats() { return this.player.stats; }

    // === DAMAGE API ===
    takeDamage(amount) {
        this.player.takeDamage(amount);
    }
}
