import { SceneBootstrap } from './sceneBootstrap.js';
import { PlayerManager } from '../managers/playerManager.js';
import { EnemySystem } from '../systems/enemySystem.js';
import { CombatSystem } from '../systems/combatSystem.js';
import { StageSystem } from '../systems/stageSystem.js';
import { PickupSystem } from '../systems/pickupSystem.js';
import { GameEventHandler } from '../systems/gameEventHandler.js';
import { DifficultyManager } from '../systems/ai/difficultyManager.js';
import { StructureSystem } from '../systems/structureSystem.js';
import { CONFIG } from '../config/config.js';
import { TelegraphManager } from '../managers/telegraphManager.js';


export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        // Ensure clean state on init
        this.isShuttingDown = false;
        this.isEndlessMode = false;
        this.events.on('shutdown', this.shutdown, this);
    }

    create(data) {
        // Bootstrap geral
        this.bootstrap = new SceneBootstrap(this, data);

        // Player
        this.playerManager = new PlayerManager(this, this.bootstrap.scene.playerConfig);
        this.playerManager.create();

        // Telegraph System (Visual Feedback)
        this.telegraphManager = new TelegraphManager(this);

        // Enemies + spawner
        this.enemySystem = new EnemySystem(this, this.bootstrap.scene.enemySpawner);

        // Difficulty Manager (AI Scaling)
        // Uses CONFIG.difficulty which contains global and profile-specific scaling curves
        this.difficultyManager = new DifficultyManager(this, CONFIG.difficulty);
        this.difficultyManager.reset();

        this.pickupSystem = new PickupSystem(this);
        this.stageSystem = new StageSystem(this, this.bootstrap.scene.mapConfig);
        this.structureSystem = new StructureSystem(this);
        this.structureSystem.init();

        this.combatSystem = new CombatSystem(this);

        // Orquestra eventos globais
        this.gameEvents = new GameEventHandler(this);

        // Sync initial equipment state (Bootstrap already called equipmentManager.init)
        if (this.equipmentManager && this.equipmentManager.equippedWeapons.length > 0) {
            this.equipmentManager.equippedWeapons.forEach(key => {
                console.debug("EVENT_EMITTED", { eventName: 'weapon-equipped', payload: key });
                this.events.emit('weapon-equipped', key);
            });
        }

        // Inicia sistema de ondas
        this.enemySystem.enemySpawner.initWave(0);

        // Input - Pause
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.bootstrap && this.bootstrap.uiFlow) {
                this.bootstrap.uiFlow.togglePause();
            }
        });
    }

    update(time, delta) {
        if (this.isShuttingDown) return;

        // Pass delta to all systems (Phaser provides delta in ms)
        if (this.playerManager) this.playerManager.update(time, delta);
        if (this.enemySystem) this.enemySystem.update(time, delta);
        if (this.combatSystem) this.combatSystem.update(time, delta);
        if (this.pickupSystem) this.pickupSystem.update(time, delta);
        if (this.stageSystem) this.stageSystem.update(delta);
        if (this.structureSystem) this.structureSystem.update(time, delta);
        if (this.xpSystem) this.xpSystem.update(delta, this.player);

        // Legendary systems
        if (this.gadgetManager) this.gadgetManager.update(delta);
        if (this.companionManager) this.companionManager.update(delta);

        // DifficultyManager is time-based and uses scene.time.now
        // It does not require a manual update(delta) call in the loop
        // It tracks time via internal methods getElapsedTime() called by clients

        // Sync Hud
        if (this.hud && typeof this.hud.updateTimer === 'function') {
            if (this.isEndlessMode) {
                this.hud.updateTimer(this.stageSystem.survivalTimer);
            } else {
                this.hud.updateTimer(this.stageSystem.timeLeft, this.stageSystem.isSuddenDeath);
            }
            if (this.enemySystem && this.enemySystem.enemySpawner) {
                this.hud.updateWaveInfo(
                    this.enemySystem.enemySpawner.wave + 1,
                    this.enemySystem.enemySpawner.getEnemies().length
                );
            }
        }
    }

    /* ------------------------------------------------------------------ */
    /* -------------------------- PROXY METHODS -------------------------- */
    /* ------------------------------------------------------------------ */

    showDamagePopup(x, y, amount, color, scale, isCritical) {
        if (!this.damageTextPool) return;

        const roundedAmount = Math.round(amount);
        const text = this.damageTextPool.get(x, y, roundedAmount);
        text.setText(roundedAmount);
        text.setStyle({ fill: color });
        text.setScale(scale);

        this.tweens.add({
            targets: text,
            y: y - 100,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.out',
            onComplete: () => {
                this.damageTextPool.return(text);
            }
        });
    }
    shutdown() {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;

        console.debug('GameScene: Starting shutdown lifecycle...');

        // 0. UI Flow Cleanup (Must happen first)
        if (this.bootstrap && this.bootstrap.uiFlow) {
            this.bootstrap.uiFlow.destroy();
        }

        // 1. Clean up Event Handler
        if (this.gameEvents) {
            this.gameEvents.destroy();
        }

        // 2. Clear Timers & Tweens
        this.time.removeAllEvents();
        this.tweens.killAll();

        // 3. Destroy Systems
        if (this.weaponManager) this.weaponManager.destroy();
        if (this.pickupManager) this.pickupManager.destroy();
        if (this.telegraphManager) this.telegraphManager.destroy();
        if (this.equipmentManager) this.equipmentManager.reset();

        // Legendary systems cleanup
        if (this.legendaryRewardManager) this.legendaryRewardManager.reset();
        if (this.gadgetManager) this.gadgetManager.destroy();
        if (this.procManager) this.procManager.destroy();
        if (this.companionManager) this.companionManager.destroy();

        if (this.playerManager) {
            try {
                this.playerManager.destroy();
            } catch (e) {
                console.debug('[GameScene] Error destroying playerManager', e);
            }
        }

        if (this.structureSystem) {
            // System cleanup if any
        }

        if (this.enemySystem && this.enemySystem.enemySpawner) {
            this.enemySystem.enemySpawner.reset();
            // Safety check for group before clearing
            const enemyGroup = this.enemySystem.enemySpawner.getGroup();
            if (enemyGroup && typeof enemyGroup.clear === 'function') {
                try {
                    enemyGroup.clear(true, true);
                } catch (e) {
                    console.debug('[GameScene] Could not clear enemy group during shutdown');
                }
            }
        }

        // 4. UI Cleanup
        if (this.hud) {
            if (typeof this.hud.reset === 'function') this.hud.reset();
            this.hud.hide();
        }

        if (this.bossUIManager) this.bossUIManager.hide();
        if (this.upgradeUIManager) this.upgradeUIManager.hide();
        if (this.legendaryUIManager) this.legendaryUIManager.hide();
        if (this.gameOverUIManager) this.gameOverUIManager.hide();
        if (this.loadoutUI) {
            if (typeof this.loadoutUI.destroy === 'function') this.loadoutUI.destroy();
        }

        // 5. Input
        this.input.keyboard.off('keydown-ESC');

        // 6. Audio
        if (this.audio) {
            this.audio.stopAll();
        }

        console.debug('GameScene shutdown complete.');
    }
}
