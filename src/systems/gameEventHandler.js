export class GameEventHandler {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;
        this.audio = scene.audio;
        this.bossUI = scene.bossUIManager;
        this.bossFlow = scene.bossFlow;
        this.legendaryUI = scene.legendaryUIManager;
        this.legendaryManager = scene.legendaryRewardManager;
        this.stageSystem = scene.stageSystem;

        // Core systems
        this.weaponManager = scene.weaponManager;
        this.loadoutUI = scene.loadoutUI;
        this.procManager = scene.procManager;
        this.combatSystem = scene.combatSystem;
        this.playerManager = scene.playerManager;
        this.uiFlow = scene.bootstrap.uiFlow;

        this.register();
    }

    register() {
        this.registerPlayerEvents();
        this.registerEnemyEvents();
        this.registerCombatEvents();
        this.registerEquipmentEvents();
        this.registerSystemEvents();
        this.registerBossEvents();
        this.registerStageEvents();
        this.registerPickupEvents();
        this.registerStructureEvents();
    }

    registerPlayerEvents() {
        this.events.on('player-damaged', (amount) => {
            this.audio.play('hit');

            const ind = document.getElementById('damage-indicator');
            if (ind) {
                ind.textContent = `-${amount}`;
                ind.classList.add('show');
                setTimeout(() => ind.classList.remove('show'), 300);
            }
        });

        this.events.on('player-health-changed', (current, max) => {
            if (this.scene.hud) {
                this.scene.hud.updateHealth(current, max);
            }
        });

        this.events.on('player-died', () => {
            this.audio.play('gameover');
            this.playerManager?.onPlayerDied();
            this.uiFlow?.onPlayerDied();
        });
    }

    registerEnemyEvents() {
        this.events.on('enemy-damaged', (enemy, amount, isCritical, attacker) => {
            if (enemy.isBoss) {
                this.bossFlow?.onBossDamaged(enemy);
            }

            // Route to proc manager
            this.procManager?.onEnemyDamaged(enemy);
        });
    }

    registerCombatEvents() {
        const playShoot = () => {
            this.scene.sound.play('shoot', {
                volume: 0.5,
                detune: Phaser.Math.Between(-200, 200)
            });
        };

        this.events.on('weapon-attack', (key) => {
            playShoot();
            this.events.emit('player-attacked');
        });

        this.events.on('weapon-shoot', (key) => {
            playShoot();
            this.events.emit('player-attacked');
            this.combatSystem?.onWeaponShoot(key);
        });
    }

    registerEquipmentEvents() {
        this.events.on('weapon-equipped', (key, slot) => {
            this.weaponManager?.onWeaponEquipped(key, slot);
            this.loadoutUI?.onWeaponEquipped(key, slot);
        });

        this.events.on('weapon-leveled', (key, level) => {
            this.weaponManager?.onWeaponLeveled(key, level);
            this.loadoutUI?.onWeaponLeveled(key, level);
        });

        this.events.on('item-equipped', (id) => {
            this.loadoutUI?.onItemEquipped(id);
        });

        this.events.on('item-leveled', (id, level) => {
            this.loadoutUI?.onItemLeveled(id, level);
        });
    }

    registerSystemEvents() {
        this.events.on('level-up', () => {
            this.uiFlow?.onLevelUp();
        });

        this.events.on('legendary-drop', (item) => {
            this.uiFlow?.onLegendaryDrop(item);
        });

        this.events.on('wave-changed', (data) => {
            if (this.scene.hud) {
                this.scene.hud.setBossWave(data.isBossWave, data.index);
            }
            if (data.isBossWave) {
                this.audio.play('bosswarning');
                if (this.bossFlow && this.scene.mapConfig.boss) {
                    this.bossFlow.spawn(this.scene.mapConfig.boss);
                }
            }
        });

        this.events.on('map-completed', () => {
            if (this.scene.mapCompletedUIManager) {
                this.scene.mapCompletedUIManager.show();
            }
        });

        this.events.on('endless-mode-started', () => {
            if (this.scene.enemySystem && this.scene.enemySystem.enemySpawner) {
                this.scene.enemySystem.enemySpawner.startEndlessMode();
            }
        });
    }

    registerBossEvents() {
        this.events.on('boss-spawned', (boss) => {
            this.bossUI.show(boss);
        });

        this.events.on('boss-died', (x, y) => {
            this.bossFlow.onBossDied(x, y);
        });
    }

    registerStageEvents() {
        this.events.on('stage-event', (event) => {
            if (event.type === 'boss_spawn') {
                this.bossFlow.spawn(event.key);
            } else {
                this.stageSystem.onStageEvent(event);
            }
        });
    }
    registerPickupEvents() {
        this.events.on('pickup-collected', (pickup) => {
            const type = pickup.type;
            const player = this.playerManager.player;

            switch (type) {
                case 'health_kit':
                    player.heal(player.stats.maxHealth * 0.2);
                    break;
                case 'health_kit_big':
                    player.heal(player.stats.maxHealth * 0.5);
                    break;
                case 'map_bomb':
                    // Deals massive damage to all enemies currently on screen
                    this.scene.enemySpawner.getEnemies().forEach(enemy => {
                        // Using the standard damage system so it triggers VFX per enemy and counts as player kill
                        enemy.takeDamage(999999, false, player);
                    });
                    this.scene.cameras.main.shake(500, 0.02);
                    this.audio.play('explosion');
                    break;
                case 'magnet':
                    // Attracts all gems on map
                    if (this.scene.xpSystem) {
                        this.scene.xpSystem.activateMagnet();
                    }
                    this.audio.play('magic');
                    break;
                case 'boots':
                    // Temporary movement speed boost
                    const speedMultiplier = 0.5; // +50% speed
                    player.stats.moveSpeedStat.addMultiplier(speedMultiplier);

                    this.audio.play('evasion');

                    // Remove after 5 seconds
                    this.scene.time.delayedCall(5000, () => {
                        if (player.active) {
                            player.stats.moveSpeedStat.addMultiplier(-speedMultiplier);
                        }
                    });
                    break;
                case 'coin':
                    this.scene.coins = (this.scene.coins || 0) + 1;
                    break;
            }
        });
    }

    registerStructureEvents() {
        // Handled by VFXManager and AudioManager via configs
        // We keep the listeners here only if there is logic OUTSIDE of vfx/audio causing side effects
        // But the user asked to move vfx/audio logic.

        // Ensure events are emitted by the structure itself (Structure.js does this).
        // So we don't need to do anything here for Audio/VFX.

        // However, if we need special logic like "shake camera on big structure death", we can add it.
        // For now, clean up.
    }

    destroy() {
        this.events.off('player-damaged');
        this.events.off('player-health-changed');
        this.events.off('player-died');
        this.events.off('enemy-damaged');
        this.events.off('weapon-attack');
        this.events.off('weapon-shoot');
        this.events.off('weapon-equipped');
        this.events.off('weapon-leveled');
        this.events.off('item-equipped');
        this.events.off('item-leveled');
        this.events.off('level-up');
        this.events.off('legendary-drop');
        this.events.off('wave-changed');
        this.events.off('boss-spawned');
        this.events.off('boss-died');
        this.events.off('stage-event');
        this.events.off('pickup-collected');
        this.events.off('structure-damaged');
        this.events.off('structure-destroyed');
    }
}
