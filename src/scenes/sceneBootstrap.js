import { CONFIG, resetConfig } from '../config/config.js';
import { AudioManager } from '../managers/audio/audioManager.js';
import { VFXManager } from '../managers/vfx/vfxManager.js';

import { EnemySpawner } from '../systems/enemySpawner.js';
import { XPSystem } from '../systems/xpSystem.js';
import { UpgradeManager } from '../managers/upgradeManager.js';
import { EquipmentManager } from '../managers/equipmentManager.js';
import { WeaponManager } from '../managers/weaponManager.js';
import { LegendaryRewardManager } from '../managers/legendaryRewardManager.js';
import { GadgetManager } from '../managers/gadgetManager.js';
import { ProcManager } from '../managers/procManager.js';
import { CompanionManager } from '../managers/companionManager.js';
import { PickupManager } from '../managers/pickupManager.js';

import { DamageTextPool } from '../ui/damagePopup.js';
import { HUDManager } from '../managers/hudManager.js';
import { BossUIManager } from '../ui/bossUIManager.js';
import { LegendarySelectionUIManager } from '../ui/legendarySelectionUIManager.js';
import { UpgradeUIManager } from '../ui/upgradeUIManager.js';
import { GameOverUIManager } from '../ui/gameOverUIManager.js';
import { MapCompletedUIManager } from '../ui/mapCompletedUIManager.js';
import { LoadoutUIManager } from '../ui/loadoutUIManager.js';
import { SaveManager } from '../managers/saveManager.js';
import { AchievementManager } from '../managers/achievementManager.js';

import { UIFlowController } from '../controller/uiFlowController.js';
import { BossFlowController } from '../controller/bossFlowController.js';

import { Player } from '../entities/player/player.js';
import { PlayerCombatFacade } from '../entities/player/playerCombatFacade.js';

import { WorldManager } from '../managers/worldManager.js';

export class SceneBootstrap {
    constructor(scene, data) {
        this.scene = scene;
        this.data = data;

        this.reset();
        this.loadMapConfig();
        this.initPersistence();
        this.initStats();
        this.initAudio();
        this.initWorld();
        this.initPlayer();
        this.initCombat();
        this.initSystems();
        this.initUI();
    }

    /* ------------------------------------------------------------------ */
    /* --------------------------- CORE SETUP ---------------------------- */
    /* ------------------------------------------------------------------ */

    reset() {
        resetConfig();
    }

    loadMapConfig() {
        const { mapId } = this.data;
        this.scene.currentMapId = mapId;
        this.scene.mapConfig = CONFIG.maps.find(m => m.id === mapId);
    }

    initPersistence() {
        this.scene.saveManager = SaveManager.getInstance();
        this.scene.achievementManager = new AchievementManager();
    }

    initStats() {
        this.scene.kills = 0;
        this.scene.coins = 0;

        this.scene.gameTimer = this.scene.mapConfig.duration;
        this.scene.totalPlayTime = 0;

        this.scene.isSuddenDeath = false;
        this.scene.suddenDeathTimer = 0;
        this.scene.processedEvents = new Set();
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------ AUDIO ------------------------------ */
    /* ------------------------------------------------------------------ */

    initAudio() {
        this.scene.audio = new AudioManager(this.scene);

        if (this.scene.mapConfig.music) {
            this.scene.audio.play(this.scene.mapConfig.music, {
                loop: true,
                volume: 0.3
            });
        }
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------- WORLD ----------------------------- */
    /* ------------------------------------------------------------------ */

    initWorld() {
        this.scene.world = new WorldManager(
            this.scene,
            this.scene.mapConfig
        );
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------- PLAYER ---------------------------- */
    /* ------------------------------------------------------------------ */

    initPlayer() {
        const { charType } = this.data;

        this.scene.playerConfig = CONFIG.player.find(
            p => p.key === charType
        );

        this.scene.player = new Player(
            this.scene,
            CONFIG.world.width / 2,
            CONFIG.world.height / 2,
            this.scene.playerConfig
        );
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------- COMBAT ---------------------------- */
    /* ------------------------------------------------------------------ */

    initCombat() {
        this.scene.enemySpawner = new EnemySpawner(
            this.scene,
            this.scene.player,
            this.scene.mapConfig
        );

        // Initialize missing projectile groups
        this.scene.enemyProjectiles = this.scene.physics.add.group();
        this.scene.projectileGroup = this.scene.physics.add.group();

        this.scene.playerCombat = new PlayerCombatFacade(this.scene.player);
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------- SYSTEMS --------------------------- */
    /* ------------------------------------------------------------------ */

    initSystems() {

        this.scene.xpSystem = new XPSystem(this.scene);

        this.scene.upgradeManager = new UpgradeManager(this.scene);

        this.scene.weaponManager = new WeaponManager(this.scene);

        this.scene.equipmentManager = new EquipmentManager(this.scene);
        this.scene.equipmentManager.init(this.scene.playerConfig.weapon);

        this.scene.gadgetManager = new GadgetManager(this.scene);
        this.scene.procManager = new ProcManager(this.scene);
        this.scene.companionManager = new CompanionManager(this.scene);
        this.scene.pickupManager = new PickupManager(this.scene);
        this.scene.vfxManager = new VFXManager(this.scene);

        this.scene.legendaryRewardManager = new LegendaryRewardManager(this.scene);
    }

    /* ------------------------------------------------------------------ */
    /* -------------------------------- UI ------------------------------- */
    /* ------------------------------------------------------------------ */

    initUI() {
        this.scene.damageTextPool = new DamageTextPool(this.scene, 20);

        // UI flows (upgrade, game over, legendary, pause)
        this.scene.gameOverUIManager = new GameOverUIManager(this.scene);
        this.scene.mapCompletedUIManager = new MapCompletedUIManager(this.scene);
        this.scene.legendaryUIManager = new LegendarySelectionUIManager(this.scene);
        this.scene.upgradeUIManager = new UpgradeUIManager(this.scene);
        this.scene.hud = new HUDManager(this.scene);
        this.scene.hud.show();

        // NEW: Loadout UI shows equipped weapons/items
        this.scene.loadoutUI = new LoadoutUIManager(this.scene);

        // Initial Sync
        if (this.scene.player) {
            this.scene.hud.updateHealth(this.scene.player.health, this.scene.player.stats.maxHealth);
        }
        if (this.scene.xpSystem) {
            this.scene.hud.updateXP(this.scene.xpSystem.currentXP, this.scene.xpSystem.xpToNextLevel, this.scene.xpSystem.currentLevel);
        }

        this.uiFlow = new UIFlowController(this.scene);

        // Boss lifecycle (spawn, UI, rewards, slow motion)
        this.scene.bossUIManager = new BossUIManager(this.scene);
        this.scene.bossFlow = new BossFlowController(this.scene);

    }
}
