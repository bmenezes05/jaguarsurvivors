export class EnemyEntity {
    setup(config) {
        this.config = config;
        this.health = config.health;
        this.maxHealth = config.health;
        this.damage = config.damage;
        this.speed = config.speed;
        this.isBoss = config.isBoss || false;
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    isDead() {
        return this.health <= 0;
    }
}
