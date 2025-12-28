import { CONFIG } from '../config/config.js';
import { XPGem } from '../entities/xpGem.js';
import { ObjectPool } from '../managers/objectPool.js';

export class XPSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentXP = 0;
        this.currentLevel = 1;
        this.xpToNextLevel = CONFIG.xp.baseXPToLevel;

        this.activeGems = [];
        this.gemPool = new ObjectPool(scene, XPGem, 50);

        this.isMagnetActive = false;
    }

    update(delta, player) {
        // Recycle inactive gems and update active ones
        for (let i = this.activeGems.length - 1; i >= 0; i--) {
            const gem = this.activeGems[i];
            if (!gem.isActive) {
                this.gemPool.release(gem);
                this.activeGems.splice(i, 1);
            } else {
                gem.update(delta, player);
            }
        }
    }

    addXP(amount) {
        this.currentXP += amount;
        if (this.scene.hud) {
            this.scene.hud.updateXP(this.currentXP, this.xpToNextLevel, this.currentLevel);
        }

        if (this.currentXP >= this.xpToNextLevel) {
            this.scene.audio.play('levelup');
            this.levelUp();
        }
    }

    activateMagnet() {
        this.isMagnetActive = true;

        // Make all CURRENT active gems fly to player
        this.activeGems.forEach(gem => gem.flyToPlayer());

        // Standard magnet lasts for a specific duration or one-time pull
        // If it's the "Vacuum" pickup, it pulls everything once.
        // We'll keep it active for 5s as per previous logic.
        this.scene.time.delayedCall(5000, () => {
            this.isMagnetActive = false;
        });
    }

    levelUp() {
        this.currentLevel++;
        this.currentXP -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(CONFIG.xp.baseXPToLevel * Math.pow(CONFIG.xp.xpScaling, this.currentLevel - 1));

        console.debug("EVENT_EMITTED", { eventName: 'level-up', payload: this.currentLevel });
        this.scene.events.emit('level-up');
    }

    dropXP(x, y, value) {
        const gem = this.gemPool.get({
            x,
            y,
            gemConfig: CONFIG.xp.gems[value] || CONFIG.xp.gems[0]
        });

        this.activeGems.push(gem);

        if (this.isMagnetActive) {
            gem.flyToPlayer();
        }
    }
}