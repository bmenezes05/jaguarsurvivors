import { SceneBootstrap } from './sceneBootstrap.js';
import { PlayerManager } from '../managers/playerManager.js';
import { EnemySystem } from '../systems/enemySystem.js';
import { CombatSystem } from '../systems/combatSystem.js';
import { StageSystem } from '../systems/stageSystem.js';
import { PickupSystem } from '../systems/pickupSystem.js';
import { GameEventHandler } from '../systems/gameEventHandler.js';


export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create(data) {
        // Bootstrap geral
        this.bootstrap = new SceneBootstrap(this, data);

        // Player
        this.playerManager = new PlayerManager(this, this.bootstrap.scene.playerConfig);
        this.playerManager.create();
        // Enemies + spawner
        this.enemySystem = new EnemySystem(this, this.bootstrap.scene.enemySpawner);

        this.pickupSystem = new PickupSystem(this);
        this.stageSystem = new StageSystem(this, this.bootstrap.scene.mapConfig);
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
        // Pass delta to all systems (Phaser provides delta in ms)
        this.playerManager.update(time, delta);
        this.enemySystem.update(time, delta);
        this.combatSystem.update(time, delta);
        this.pickupSystem.update(time, delta);
        this.stageSystem.update(delta);
        this.xpSystem.update(delta, this.player);

        // Sync Hud
        if (this.hud) {
            this.hud.updateTimer(this.stageSystem.timeLeft, this.stageSystem.isSuddenDeath);
            this.hud.updateWaveInfo(
                this.enemySystem.enemySpawner.wave + 1,
                this.enemySystem.enemySpawner.enemies.length,
                this.kills
            );
        }
    }

    /* ------------------------------------------------------------------ */
    /* -------------------------- PROXY METHODS -------------------------- */
    /* ------------------------------------------------------------------ */

    showDamagePopup(x, y, amount, color, scale, isCritical) {
        if (!this.damageTextPool) return;

        const text = this.damageTextPool.get(x, y, amount);
        text.setText(amount);
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
}
