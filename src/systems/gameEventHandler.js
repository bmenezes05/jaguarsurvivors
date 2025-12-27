export class GameEventHandler {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;
        this.juice = scene.juice;
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
    }

    registerPlayerEvents() {
        this.events.on('player-damaged', (amount) => {
            this.juice.shake(0.015, 200);
            this.juice.hitStop(50);
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
            this.juice.flash(enemy.sprite, 0xFFFFFF, 100);
            this.juice.pulse(enemy.container, 1.1, 50);

            if (isCritical) {
                this.juice.hitStop(30);
                this.juice.shake(0.005, 30);
            }

            this.scene.showDamagePopup(
                enemy.x,
                enemy.y,
                Math.floor(amount),
                isCritical ? '#FF4500' : (enemy.isBoss ? '#FFD700' : '#FFFFFF'),
                isCritical ? 1.8 : 1.0,
                isCritical
            );

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
        });

        this.events.on('weapon-shoot', (key) => {
            playShoot();
            this.combatSystem?.onWeaponShoot(key);
        });
    }

    registerEquipmentEvents() {
        this.events.on('weapon-equipped', (key) => {
            this.weaponManager?.onWeaponEquipped(key);
            this.loadoutUI?.onWeaponEquipped(key);
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
    }

    registerBossEvents() {
        this.events.on('boss-spawned', (boss) => {
            this.bossUI.show(boss);
            this.scene.cameras.main.flash(500, 100, 0, 0);
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
}
