export class Projectile {
    constructor(scene) {
        this.scene = scene;

        this.active = false;
        this.lifeTime = 0;

        this.visual = scene.physics.add.sprite(0, 0, 'pixel');
        this.body = this.visual.body;

        this.visual
            .setActive(false)
            .setVisible(false)
            .setDepth(2000);

        this.body.enable = false;

        // ligação reversa para colisão
        this.visual.setData('projectile', this);
    }

    /* ------------------------------------------------------------------ */
    /* -------------------------- POOL API ------------------------------- */
    /* ------------------------------------------------------------------ */

    setActive(value) {
        this.active = value;
        this.visual.setActive(value);
        this.body.enable = value;
    }

    setVisible(value) {
        this.visual.setVisible(value);
    }

    spawn(config) {
        this.setActive(true);
        this.setVisible(true);
        this.init(config);
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------- INITIALIZATION -------------------------- */
    /* ------------------------------------------------------------------ */

    init({
        x, y,
        targetX, targetY,
        damage,
        weapon,
        projectileSpeed,
        isCritical,
        knockbackMultiplier
    }) {
        this.damage = damage;
        this.weapon = weapon;
        this.isCritical = isCritical;
        this.knockbackMultiplier = knockbackMultiplier ?? 1;
        this.lifeTime = 0;

        this.visual.setPosition(x, y);

        this.applyVisuals();
        this.applyVelocity(x, y, targetX, targetY, projectileSpeed);
    }

    applyVisuals() {
        const { weapon, isCritical } = this;

        // Use new trail property names with fallback to legacy projectile names
        const texture = weapon.trailTexture ?? weapon.projectileTexture;
        const color = weapon.trailColor ?? weapon.projectileColor ?? 0xffd700;
        const scale = weapon.trailScale ?? weapon.projectileScale ?? 1;
        const shouldRotate = weapon.trailRotation ?? weapon.projectileRotation;

        if (texture) {
            this.visual.setTexture(texture);
            this.visual.setTint(0xffffff);
        } else {
            this.visual.setTexture('pixel');
            this.visual.setTint(isCritical ? 0xff4500 : color);
        }

        this.visual.setScale(isCritical ? scale * 1.5 : scale);

        this.scene.tweens.killTweensOf(this.visual);

        if (shouldRotate) {
            this.scene.tweens.add({
                targets: this.visual,
                angle: 360,
                duration: 500,
                repeat: -1
            });
        }
    }

    applyVelocity(x, y, tx, ty, speed = 500) {
        const angle = Math.atan2(ty - y, tx - x);
        this.visual.setRotation(angle);
        this.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    /* ------------------------------------------------------------------ */
    /* ---------------------------- UPDATE -------------------------------- */
    /* ------------------------------------------------------------------ */

    /**
     * Updates the projectile/trail state
     * Uses lifetimeMs for trail weapons, falls back to range for legacy support
     * @param {number} delta - Time since last update in ms
     */
    update(delta) {
        if (!this.active) return;

        this.lifeTime += delta;

        // Use lifetimeMs for trail weapons, fall back to range for backward compatibility
        // Default lifetime is 2000ms
        const maxLifetime = this.weapon.lifetimeMs ?? this.weapon.range ?? 2000;

        if (this.lifeTime > maxLifetime) {
            this.kill();
        }
    }

    /* ------------------------------------------------------------------ */
    /* ---------------------------- HIT ---------------------------------- */
    /* ------------------------------------------------------------------ */

    hit(enemy) {
        if (!this.active) return;

        enemy.takeDamage(this.damage, this.isCritical);

        if (this.weapon.elementalEffect) {
            enemy.applyEffect(
                this.weapon.elementalEffect,
                this.weapon.dotDamage,
                this.weapon.dotDuration
            );
        }

        this.kill();
    }

    kill() {
        this.active = false;
        this.setVisible(false);
        this.body.enable = false;
        this.body.setVelocity(0, 0);
    }

    get isActive() {
        return this.active;
    }
}
