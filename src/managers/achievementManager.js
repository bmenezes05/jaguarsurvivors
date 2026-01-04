import { SaveManager } from './saveManager.js';
import { CONFIG } from '../config/index.js';


export class AchievementManager {
    constructor() {
        this.saveManager = SaveManager.getInstance();
        this.checks = [
            {
                id: 'unlock_ucraniaman',
                type: 'kills',
                target: 1000,
                rewardType: 'char',
                rewardId: 'ucraniaman',
                description: 'Mate 1000 inimigos totais.'
            },
            {
                id: 'unlock_samurai',
                type: 'survival_time', // Note: Needs runtime check during game
                target: 600, // 10 minutes
                rewardType: 'char',
                rewardId: 'samurai',
                description: 'Sobreviva por 10 minutos em uma única run.'
            },
            {
                id: 'unlock_miss',
                type: 'coins',
                target: 5000, // Total lifetime coins or currently held? Let's go lifetime holding for now or just check saveManager coins
                rewardType: 'char',
                rewardId: 'miss',
                description: 'Acumule 5000 moedas.'
            }
        ];
    }

    checkGlobalUnlocks() {
        const data = this.saveManager.data;

        // Unlock Ucraniaman
        if (data.totalKills >= 1000) {
            this.unlock('ucraniaman');
        }

        // Unlock Miss (Coin check)
        if (data.coins >= 5000) { // Simple check, maybe too easy if spending coins?
            // For now, let's assume it's current holding.
            // Better design: track 'lifetime earnings'. But using current balance is a strategic tradeoff.
            this.unlock('miss');
        }

        if (this.saveManager.areAllCharsUnlocked()) {
            this.unlockAchievement('unlock_all_characters');
        }
    }

    checkEndRunUnlocks(runData) {
        if (runData.survivalTimeSeconds >= 600) {
            this.unlock('samurai');
        }

        if (runData.bossDefeated) {
            this.unlockAchievement(`defeat_${runData.mapId}_boss`);

            if (this.saveManager.hasWonWithAllCharacters(runData.charId)) {
                this.unlockAchievement('win_with_all_characters');
            }
        }

        if (runData.reachedEndless) {
            this.unlockAchievement('reach_endless_mode');
        }

        if (runData.maxLevelItem) {
            this.unlockAchievement('max_level_item');
        }
    }

    unlock(charId) {
        this.saveManager.unlockChar(charId);
    }

    unlockAchievement(achievementId) {
        this.saveManager.unlockAchievement(achievementId);
    }
}
