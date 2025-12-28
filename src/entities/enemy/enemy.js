import { EnemyProjectile } from '../enemyProjectile.js';
import { CONFIG } from '../../config/config.js';

export class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.activeEffects = new Map();
        this.effectVisuals = {};
        this.originalTint = 0xFFFFFF;

        // Container creation - done ONCE
        this.container = scene.add.container(0, 0);
        this.container.setData('parent', this);

        // Create empty sprites initially, textures set in spawn
        this.shadow = scene.add.image(0, 0, 'shadow').setAlpha(0.5).setDepth(-1);
        this.sprite = scene.add.image(0, 0, null);
        this.leftLeg = scene.add.image(0, 0, null);
        this.rightLeg = scene.add.image(0, 0, null);
        this.container.add([this.shadow, this.leftLeg, this.rightLeg, this.sprite]);

        // Physics Setup
        scene.physics.add.existing(this.container);

        this.isActive = false;
    }

    setActive(value) {
        this.isActive = value;
        if (this.container) this.container.setActive(value);
        if (this.container && this.container.body) this.container.body.enable = value;
    }

    setVisible(value) {
        if (this.container) this.container.setVisible(value);
    }

    spawn(config) {
        const { x, y, enemyConfig } = config;
        this.enemy = enemyConfig;
        this.damage = enemyConfig.damage;
        this.canShoot = enemyConfig.canShoot || false;
        this.walkTime = 0;
        this.isActive = true;
        this.health = enemyConfig.health;
        this.maxHealth = enemyConfig.health;
        this.isBoss = enemyConfig.isBoss || false;
        this.isEnraged = false;
        this.stompTimer = 0;
        this.bossSpawned = false; // Flag reset
        this.activeEffects.clear();
        this.isStunned = false;
        this.isTelegraphing = false;

        if (this.telegraphLine) {
            this.telegraphLine.destroy();
            this.telegraphLine = null;
        }

        // Apply Config
        this.sprite.setTexture(enemyConfig.key);
        this.leftLeg.setTexture(enemyConfig.key + "_legs");
        this.rightLeg.setTexture(enemyConfig.key + "_legs");

        const tint = enemyConfig.tint || 0xFFFFFF;
        this.sprite.setTint(tint);
        this.originalTint = tint;

        const bodyScale = enemyConfig.bodyScale || 0.4;
        this.sprite.setScale(bodyScale);

        const legsScale = enemyConfig.legsScale || 0.4;
        this.leftLeg.setScale(legsScale);
        this.rightLeg.setScale(legsScale);

        const legOffset = enemyConfig.legOffset || { x: -6, y: 16 };
        const legOrigin = enemyConfig.legOrigin || { x: 0.5, y: -1 };

        this.leftLeg.setPosition(legOffset.x, legOffset.y);
        this.rightLeg.setPosition(-legOffset.x, legOffset.y);
        this.leftLeg.setOrigin(legOrigin.x, legOrigin.y);
        this.rightLeg.setOrigin(legOrigin.x, legOrigin.y);

        this.bodyWidth = enemyConfig.bodyWidth || 60;
        this.bodyHeight = enemyConfig.bodyHeight || 100;

        // Shadow Setup
        const shadowScaling = (this.bodyWidth / 64) * 1.5;
        this.shadow.setPosition(0, this.bodyHeight / 2);
        this.shadow.setScale(shadowScaling, shadowScaling * 0.5);

        // Physics State Reset
        this.container.setPosition(x, y);
        this.container.setVisible(true);
        this.container.setActive(true);
        this.container.body.enable = true;
        this.container.body.setSize(this.bodyWidth, this.bodyHeight);
        this.container.body.setOffset(-this.bodyWidth / 2, -this.bodyHeight / 2);
        this.container.body.setVelocity(0, 0);
        this.container.body.setDrag(enemyConfig.friction || 0);
        this.container.body.setMaxVelocity(enemyConfig.speed);
    }

    update(player, delta) {
        if (!this.isActive) return;

        const targetX = player.x;
        const targetY = player.y;

        // BOSS MECHANICS
        if (this.isBoss) {
            // 1. Enrage Phase
            const bossData = this.enemy.bossData || {};
            if (!this.isEnraged && this.health <= this.maxHealth * (bossData.enrageHealthThreshold || 0.5)) {
                this.isEnraged = true;
                this.sprite.setTint(bossData.enrageTint || 0xFF0000);
                this.enemy.speed *= (1 + (bossData.enrageSpeedBonus || 0.2));

                // Visual Pop
                this.scene.tweens.add({
                    targets: this.sprite,
                    scale: this.sprite.scaleX * 1.2,
                    yoyo: true,
                    duration: 200
                });
            }

            // 2. Stomp Effect
            this.stompTimer = (this.stompTimer || 0) + delta;
            if (this.stompTimer >= (bossData.stompInterval || 2000)) {
                this.stompTimer = 0;
                // Create Stomp Graphic
                const stompCircle = this.scene.add.circle(this.container.x, this.container.y, 10, 0xFF0000, 0.4);
                this.scene.tweens.add({
                    targets: stompCircle,
                    scale: 5,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => stompCircle.destroy()
                });
                // Shake slightly
                this.scene.cameras.main.shake(100, 0.005);
            }
        }

        const angle = Phaser.Math.Angle.Between(this.container.x, this.container.y, targetX, targetY);
        let moveSpeed = this.enemy.speed;

        if (this.canShoot && Phaser.Math.Distance.Between(this.container.x, this.container.y, targetX, targetY) < this.enemy.shootRange) {
            if (!this.isTelegraphing) {
                this.startTelegraph(player);
            }
        }

        // Se estiver sob efeito de knockback OR Telegraphing, a velocidade é alterada
        if (this.knockbackDuration > 0) {
            // O knockback é aplicado no applyKnockback, aqui apenas o tempo passa.
            this.knockbackDuration -= 1;
            moveSpeed = 0; // Impede que o movimento normal anule o knockback
        } else if (this.isTelegraphing) {
            moveSpeed = 0; // Stop while aiming
            // Update line if it exists
            if (this.telegraphLine) {
                this.telegraphLine.clear();
                this.telegraphLine.lineStyle(2, 0xFF0000, 0.5);
                this.telegraphLine.beginPath();
                this.telegraphLine.moveTo(0, 0);
                const relX = player.x - this.container.x;
                const relY = player.y - this.container.y;
                this.telegraphLine.lineTo(relX, relY);
                this.telegraphLine.strokePath();
            }
        } else {
            // Use calculated speed
            moveSpeed = this.getSpeed();

            this.container.body.setVelocity(
                Math.cos(angle) * moveSpeed,
                Math.sin(angle) * moveSpeed
            );

            // Flip
            if (this.sprite.texture) {
                // Se a velocidade X for negativa (movendo para a esquerda), _facingRight é falso
                const facingRight = this.container.body.velocity.x >= 0;

                // 1. Flip Visual: Espelha o container
                this.container.setScale(facingRight ? 1 : -1, 1);

                // 2. Correção do Hitbox: Inverte o offset horizontal
                const newOffsetX = facingRight ? (-this.bodyWidth / 2) : (this.bodyWidth / 2);
                this.container.body.setOffset(newOffsetX, -this.bodyHeight / 2);
            }

            // Animate feet (always walking)
            if (this.leftLeg && this.rightLeg && !this.isStunned) {
                // Get animation config with fallbacks
                const anim = this.enemy.animation || {};
                const swingSpeed = anim.walkSwingSpeed || 0.015;
                const swingAmp = anim.walkSwingAmplitude || 0.15;
                const bobSpeed = anim.walkBobSpeed || 0.02;
                const bobAmp = anim.walkBobAmplitude || 1;
                const legOffset = this.enemy.legOffset || { x: -6, y: 16 };
                const baseY = legOffset.y;

                this.walkTime += 1;
                const swing = Math.sin(this.walkTime * swingSpeed) * swingAmp;
                this.leftLeg.rotation = swing;
                this.rightLeg.rotation = -swing;
                const bob = Math.sin(this.walkTime * bobSpeed) * bobAmp;
                this.leftLeg.y = baseY + bob;
                this.rightLeg.y = baseY + bob;
            }
        }

        this.updateEffects(delta);

        if (this.health <= 0) this.die();
    }

    takeDamage(amount, isCritical = false, attacker = null) {
        this.health -= amount;
        // Emit event for visual feedback (decoupled)
        console.debug("EVENT_EMITTED", { eventName: 'enemy-damaged', payload: { target: this.enemy.key, amount, isCritical, attacker: attacker ? 'player' : 'other' } });
        this.scene.events.emit('enemy-damaged', this, amount, isCritical, attacker);
    }

    applyEffect(type, damage, duration) {
        if (!type || type === 'none') return;

        type = type.toLowerCase();

        this.activeEffects.set(type, {
            duration: duration,
            tickTimer: 0,
            damage: damage,
            tickInterval: 500 // 0.5s ticks
        });

        console.debug("EVENT_EMITTED", { eventName: 'status-applied', payload: { target: this.enemy.key, type } });
        this.scene.events.emit('status-applied', this, type);
        this.updateVisuals();
    }

    updateEffects(delta) {
        let speedMod = 1.0;
        this.isStunned = false;

        // Process all active effects
        for (const [type, effect] of this.activeEffects.entries()) {
            effect.duration -= delta;
            effect.tickTimer += delta;

            // Tick Damage
            if (effect.tickTimer >= effect.tickInterval) {
                effect.tickTimer = 0;
                if (effect.damage > 0) {
                    this.takeDamage(effect.damage, false, null);
                }
            }

            // Apply mechanics
            if (type === 'freeze') speedMod *= 0.4;
            if (type === 'stun') this.isStunned = true;

            if (effect.duration <= 0) {
                this.activeEffects.delete(type);
                this.updateVisuals();
            }
        }
    }

    getSpeed() {
        if (this.isStunned) return 0;
        let s = this.enemy.speed; // This is the base config speed
        if (this.activeEffects.has('freeze')) s *= 0.4;
        return s;
    }

    updateVisuals() {
        // Simple priority: Stun > Freeze > Burn > Poison
        if (this.activeEffects.has('stun')) {
            this.sprite.setTint(0xFFFF00);
        } else if (this.activeEffects.has('freeze')) {
            this.sprite.setTint(0x00FFFF);
        } else if (this.activeEffects.has('burn')) {
            this.sprite.setTint(0xFF7700);
        } else if (this.activeEffects.has('poison')) {
            this.sprite.setTint(0x00FF00);
        } else {
            this.sprite.clearTint();
        }
    }

    applyKnockback(force, duration) {
        const angle = Phaser.Math.Angle.Between(this.container.x, this.container.y, this.scene.player.x, this.scene.player.y);
        const knockbackAngle = angle + Math.PI;

        this.container.body.setVelocity(
            Math.cos(knockbackAngle) * force,
            Math.sin(knockbackAngle) * force
        );
        this.knockbackDuration = duration;
    }

    die() {
        if (Math.random() < this.enemy.xpDropChance) {
            const droppedXP = Math.floor(Math.random() * this.enemy.xpValue);
            this.scene.xpSystem.dropXP(this.container.x, this.container.y, droppedXP);
        }
        this.scene.kills++;

        if (this.isBoss) {
            console.debug("EVENT_EMITTED", { eventName: 'boss-died', payload: { x: this.container.x, y: this.container.y } });
            this.scene.events.emit('boss-died', this.container.x, this.container.y);
        }

        // DROP LOGIC
        if (this.enemy.dropChance && Math.random() < this.enemy.dropChance) {
            const tableKey = this.enemy.lootTable || 'common';
            const table = CONFIG.pickups.tables[tableKey];

            if (table) {
                const totalWeight = table.reduce((sum, item) => sum + item.chance, 0);
                let random = Math.random() * totalWeight;

                for (const item of table) {
                    if (random < item.chance) {
                        if (this.scene.pickupManager) {
                            this.scene.pickupManager.spawn(this.x, this.y, item.type);
                        }
                        break;
                    }
                    random -= item.chance;
                }
            }
        }

        // COIN DROP LOGIC (Independent check)
        const coinChance = this.enemy.coinChance || 0.05;
        if (Math.random() < coinChance) {
            if (this.scene.pickupManager) {
                this.scene.pickupManager.spawn(this.x + 10, this.y + 10, 'coin');
            }
        }

        // POISON SPREAD LOGIC
        if (this.activeEffects.has('poison')) {
            // Spread to nearby
            const range = 150;
            const nearby = this.scene.enemySpawner.enemies.filter(e =>
                e !== this && e.isActive &&
                Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y) < range
            );

            nearby.forEach(e => {
                e.applyEffect('poison', 1, 2000);
            });
        }

        if (this.telegraphLine) {
            this.telegraphLine.destroy();
        }

        this.destroy();
    }

    destroy() {
        // When 'destroyed' in game logic, we release to pool instead of actual destroy
        this.isActive = false;
        this.container.setVisible(false);
        this.container.setActive(false);
        this.container.body.enable = false;
        this.container.body.setVelocity(0, 0);

        if (this.telegraphLine) {
            this.telegraphLine.destroy();
            this.telegraphLine = null;
        }

        // The spawner handles the actual 'returnToPool' call by filtering isActive list 
        // OR better: call back to spawner? 
        // For now, we set isActive=false. The Spawner update loop filters generic array. 
        // But for ObjectPool, we need to explicitly push it back.
        // It's cleaner if specific Entity methods call pool.release(this) if they have ref, 
        // or just rely on Manager to sweep.

        // Let's assume Spawner will handle the sweeping of !isActive entities back to pool.
    }

    startTelegraph(player) {
        this.isTelegraphing = true;
        this.telegraphLine = this.scene.add.graphics();
        this.container.add(this.telegraphLine);

        // Visual: Red Line
        this.telegraphLine.lineStyle(2, 0xFF0000, 0.5);
        this.telegraphLine.beginPath();

        const relX = player.x - this.container.x;
        const relY = player.y - this.container.y;

        this.telegraphLine.moveTo(0, 0);
        this.telegraphLine.lineTo(relX, relY);
        this.telegraphLine.strokePath();

        // Timer to shoot
        this.scene.time.delayedCall(1000, () => {
            if (this.isActive && this.health > 0) {
                this.isTelegraphing = false;
                if (this.telegraphLine) {
                    this.telegraphLine.destroy();
                    this.telegraphLine = null;
                }
                this.shoot(player);
            }
        });
    }

    shoot(player) {
        const bullet = new EnemyProjectile(this.scene, this.container.x, this.container.y, player, this.enemy);
        if (this.scene.enemyProjectiles) {
            this.scene.enemyProjectiles.add(bullet.sprite);
        }
        this.canShoot = false;
        this.scene.time.addEvent({ delay: this.enemy.shootInterval, callback: () => this.canShoot = true });
    }

    get x() { return this.container.x; }
    get y() { return this.container.y; }
}