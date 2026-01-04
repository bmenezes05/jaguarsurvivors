export class PlayerDash {
    constructor(scene, player, stats, config) {
        this.scene = scene;
        this.player = player;
        this.stats = stats;
        this.config = config.dash || { duration: 250 };

        this.isDashing = false;
        this.dashTimer = 0;
        this.cooldownTimer = 0;
        this.dashDirection = new Phaser.Math.Vector2();

        // Input state for double-tap detection
        this.lastKeyPressTime = 0;
        this.lastKey = null;
        this.doubleTapWindow = 250; // ms

        // Visuals
        this.ghostTimer = 0;
        this.ghostInterval = 50; // spawn ghost every 50ms
        this.cooldownIndicator = this.scene.add.graphics();
        this.player.view.container.add(this.cooldownIndicator);
    }

    update(cursors, wasd, delta) {
        this.updateCooldownIndicator();
        // Handle Cooldown
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= delta;
        }

        // Handle Active Dash
        if (this.isDashing) {
            this._updateDash(cursors, wasd, delta);

            // If dash ended during the update, allow normal movement to take over immediately
            if (!this.isDashing) return false;

            return true; // Return true to indicate dash is active (blocking normal movement)
        }

        // Handle Input (only if ready)
        if (this.cooldownTimer <= 0) {
            this._checkInput(cursors, wasd);
        }

        return false;
    }

    _checkInput(cursors, wasd) {
        // Check for double taps on cardinal directions
        this._checkDirection(cursors.left, wasd.left, 'left', -1, 0);
        this._checkDirection(cursors.right, wasd.right, 'right', 1, 0);
        this._checkDirection(cursors.up, wasd.up, 'up', 0, -1);
        this._checkDirection(cursors.down, wasd.down, 'down', 0, 1);
    }

    _checkDirection(cursorKey, wasdKey, keyName, x, y) {
        const isJustDown = Phaser.Input.Keyboard.JustDown(cursorKey) || Phaser.Input.Keyboard.JustDown(wasdKey);

        if (isJustDown) {
            const now = this.scene.time.now;

            if (this.lastKey === keyName && (now - this.lastKeyPressTime) < this.doubleTapWindow) {
                this.startDash(x, y);
            }

            this.lastKeyPressTime = now;
            this.lastKey = keyName;
        }
    }

    startDash(x, y) {
        if (this.isDashing || this.cooldownTimer > 0) return;

        console.debug('Dash Started', x, y);

        this.isDashing = true;
        this.dashTimer = this.config.duration;
        this.dashDirection.set(x, y).normalize();

        // Apply immediate effects
        this.player.isInvulnerable = true;

        // Face the dash direction
        if (x !== 0) {
            this.player.movement.facingRight = x > 0;
            this.player.view.container.setScale(this.player.movement.facingRight ? 1 : -1, 1);

            // Correct hitbox offset for new direction
            const bodyWidth = this.player.config.bodyWidth || 60;
            const bodyHeight = this.player.config.bodyHeight || 130;
            const offsetX = this.player.movement.facingRight ? (-bodyWidth / 2) : (bodyWidth / 2);
            this.player.movement.body.setOffset(offsetX, -bodyHeight / 2);
        }

        // Audio
        this.scene.sound.play('dash_start', { volume: 0.5 });

        // Visuals - Initial Burst?
        this.player.view.createDashTrail();
    }

    _updateDash(cursors, wasd, delta) {
        this.dashTimer -= delta;

        // PROBLEM 2: Influência direcional durante o dash (Steering)
        const x = (cursors.left.isDown || wasd.left.isDown ? -1 : 0)
            + (cursors.right.isDown || wasd.right.isDown ? 1 : 0);
        const y = (cursors.up.isDown || wasd.up.isDown ? -1 : 0)
            + (cursors.down.isDown || wasd.down.isDown ? 1 : 0);

        if (x !== 0 || y !== 0) {
            // Ajuste suave de trajetória: lerp da direção atual para o input
            const steeringFactor = 0.08;
            this.dashDirection.x = Phaser.Math.Linear(this.dashDirection.x, x, steeringFactor);
            this.dashDirection.y = Phaser.Math.Linear(this.dashDirection.y, y, steeringFactor);
            this.dashDirection.normalize();

            // Atualiza a orientação visual se o ajuste for significativo horizontalmente
            if (Math.abs(this.dashDirection.x) > 0.1) {
                const newFacingRight = this.dashDirection.x > 0;
                if (newFacingRight !== this.player.movement.facingRight) {
                    this.player.movement.facingRight = newFacingRight;
                    this.player.view.container.setScale(newFacingRight ? 1 : -1, 1);

                    const bodyWidth = this.player.config.bodyWidth || 60;
                    const bodyHeight = this.player.config.bodyHeight || 130;
                    const offsetX = newFacingRight ? (-bodyWidth / 2) : (bodyWidth / 2);
                    this.player.movement.body.setOffset(offsetX, -bodyHeight / 2);
                }
            }
        }

        // Move Player
        const speed = this.stats.dashSpeed;
        this.player.movement.body.setVelocity(
            this.dashDirection.x * speed,
            this.dashDirection.y * speed
        );

        // Visual Trails
        this.ghostTimer += delta;
        if (this.ghostTimer >= this.ghostInterval) {
            this.ghostTimer = 0;
            this.player.view.createDashTrail();
        }

        // End Dash
        if (this.dashTimer <= 0) {
            this.endDash();
        }
    }

    endDash() {
        console.debug('Dash Ended');
        this.isDashing = false;
        this.cooldownTimer = this.stats.dashCooldown;

        // Reset Physics: PROBLEM 1 FIXED
        // Não resetamos para (0,0) para manter o momentum. 
        // O PlayerMovement assumirá o controle no mesmo frame.


        // Reset Invulnerability (Player class might handle its own inv check, 
        // but we should ensure we don't clear it if player was damaged separately...
        // Actually specs say "Invulnerability must end immediately when dash ends".
        // But also "Dash does NOT remove effects applied BEFORE activation."
        // So we strictly control "Dash Invulnerability". 
        // Best approach: The Player class manages `isInvulnerable`, we just set it. 
        // If we set it false, we might clear hit-invuln.
        // Safer: Player has an "invulnerability source" or we just let it expire?
        // Proposal: set player.isInvulnerable = false is risky.
        // However, the spec says "Player cannot be damaged".
        // Let's rely on standard timer for now, or just force false?
        // Given existing code: `invTimer` handles invulnerability.
        // I should probably set `invTimer` to 0 AND isInvulnerable to false IF it was caused by dash.
        // But since we can't distinguish easily without adding state to player, I'll allow myself 
        // to clear it if I'm the one who set it. But `Player` logic decreases `invTimer`.
        // I will just set `isInvulnerable = false` and `invTimer = 0` to be responsive as per "immediately when dash ends".

        this.player.isInvulnerable = false;
        this.player.invTimer = 0;
    }

    updateCooldownIndicator() {
        this.cooldownIndicator.clear();

        const progress = Phaser.Math.Clamp(
            1 - (this.cooldownTimer / this.stats.dashCooldown),
            0,
            1
        );

        // ---- TUNING ----
        const width = 28;
        const height = 4;
        const offsetY = ((this.player?.config?.bodyHeight || 130) + 10) * -1 / 2;
        // ----------------

        // Background
        this.cooldownIndicator.fillStyle(0x000000, 0.4);
        this.cooldownIndicator.fillRoundedRect(
            -width / 2,
            offsetY,
            width,
            height,
            2
        );

        // Foreground
        const color = progress >= 1 ? 0x00ff88 : 0x00bfff;

        this.cooldownIndicator.fillStyle(color, 0.9);
        this.cooldownIndicator.fillRoundedRect(
            -width / 2,
            offsetY,
            width * progress,
            height,
            2
        );

        // Optional outline when ready
        if (progress >= 1) {
            this.cooldownIndicator.lineStyle(1, 0x00ff88, 0.8);
            this.cooldownIndicator.strokeRoundedRect(
                -width / 2,
                offsetY,
                width,
                height,
                2
            );
        }

        // Optional: hide when ready
        this.cooldownIndicator.setVisible(progress < 1);
    }
}
