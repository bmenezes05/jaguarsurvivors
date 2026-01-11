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
            .setDepth(0);

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
    }

    applyVisuals() {
        const { weapon, isCritical } = this;
        // The 'weapon' prop here is actually the config passed from strategy.
        // We expect it to optionally contain a 'projectiles' object (from our new schema)
        // or fall back to strategyStats mixing.

        // Check for new 'projectileVisuals' object first
        const visuals = weapon.projectileVisuals || {};

        // TEXTURE
        // Priority: Visual Config > Legacy > Pixel
        let texture = visuals.spriteKey
            || weapon.trailTexture
            || weapon.projectileTexture
            || 'pixel';

        // SCALING
        let scale = visuals.scale
            || weapon.trailScale
            || weapon.projectileScale
            || 1;

        if (isCritical) scale *= 1.5;

        // TINT
        // If sprite is 'pixel', we default to a color.
        // If sprite is an image, we usually want clear tint unless specified.
        let tint = visuals.tint;
        if (tint === undefined) {
            // Fallback to legacy color if not pixel
            if (texture === 'pixel') {
                tint = weapon.trailColor ?? weapon.projectileColor ?? 0xffd700;
                if (isCritical) tint = 0xff4500;
            } else {
                // For sprites, default to no tint (0xffffff is white/clear in Phaser logic if using setTint)
                // But typically undefined/null means "don't tint".
                // Let's use 0xffffff (white) which acts as "no tint" for colored sprites.
                tint = 0xffffff;
            }
        }

        // Apply
        this.visual.setTexture(texture);
        this.visual.setScale(scale);
        this.visual.setTint(tint);

        // Center hitbox on sprite
        // We use the texture dimensions if available, otherwise fallback to reasonable default
        const width = this.visual.width || 32;
        const height = this.visual.height || 32;
        this.body.setSize(width, height);
        this.body.setOffset(0, 0); // Sprite origin is 0.5,0.5 by default, so 0,0 offset is centered

        // ANIMATIONS
        this.scene.tweens.killTweensOf(this.visual);

        if (visuals.animations && Array.isArray(visuals.animations)) {
            visuals.animations.forEach(anim => this.applyAnimation(anim));
        } else {
            // Legacy Rotation Support
            const shouldRotate = weapon.trailRotation ?? weapon.projectileRotation;
            if (shouldRotate) {
                this.scene.tweens.add({
                    targets: this.visual,
                    angle: 360,
                    duration: 500,
                    repeat: -1
                });
            }
        }
    }

    applyAnimation(anim) {
        if (!anim || !anim.type) return;

        switch (anim.type) {
            case 'rotate':
                this.scene.tweens.add({
                    targets: this.visual,
                    angle: anim.speed > 0 ? 360 : -360,
                    duration: Math.abs(360 / (anim.speed || 360) * 1000), // speed in deg/s approximately
                    repeat: -1,
                    image: 'Linear'
                });
                break;

            case 'pulse':
                this.scene.tweens.add({
                    targets: this.visual,
                    scale: this.visual.scale * (anim.scaleMax || 1.1),
                    duration: anim.duration || 500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                break;
        }
    }

    applyVelocity(x, y, tx, ty, speed = 500) {
        const angle = Math.atan2(ty - y, tx - x);
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

        this.scene.events.emit('enemy-damaged', {
            target: enemy,
            damage: this.damage,
            isCritical: this.isCritical,
            weapon: this.weapon
        });

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
