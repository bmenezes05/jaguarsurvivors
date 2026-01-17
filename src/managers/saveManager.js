import { CONFIG } from '../config/index.js';

export class SaveManager {
    constructor() {
        this.saveKey = 'jaguar_survivors_save_v1';
        this.data = {
            coins: 0,
            totalKills: 0,
            unlockedChars: ['presida'],
            metaUpgrades: {
                health: 0, // Rank 0
                damage: 0,
                goldGain: 0,
                moveSpeed: 0,
                revival: 0
            },
            settings: {
                volume: 1.0,
                screenShake: true,
                fullscreen: false,
                resolution: '1280x720'
            },
            achievements: []
        };

        this.load();
    }

    static getInstance() {
        if (!SaveManager.instance) {
            SaveManager.instance = new SaveManager();
        }
        return SaveManager.instance;
    }

    load() {
        const savedData = localStorage.getItem(this.saveKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Merge strategies to ensure new fields are added if save is old
                this.data = { ...this.data, ...parsed, settings: { ...this.data.settings, ...(parsed.settings || {}) }, metaUpgrades: { ...this.data.metaUpgrades, ...(parsed.metaUpgrades || {}) } };
            } catch (e) {
                console.error('Failed to parse save data', e);
            }
        }
    }

    save() {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save game', e);
        }
    }

    // == CURRENCY & STATS ==
    addCoins(amount) {
        this.data.coins += amount;
        this.save();
    }

    addKills(amount) {
        this.data.totalKills += amount;
        this.save();
    }

    spendCoins(amount) {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }

    // == UNLOCKS ==
    unlockChar(charKey) {
        if (!this.data.unlockedChars.includes(charKey)) {
            this.data.unlockedChars.push(charKey);
            this.save();
            return true;
        }
        return false;
    }

    isCharUnlocked(charKey) {
        return this.data.unlockedChars.includes(charKey);
    }

    // == UPGRADES ==
    getUpgradeRank(id) {
        return this.data.metaUpgrades[id] || 0;
    }

    upgradeMeta(id) {
        if (this.data.metaUpgrades[id] !== undefined) {
            this.data.metaUpgrades[id]++;
            this.save();
            return this.data.metaUpgrades[id];
        }
        return 0;
    }

    // == SETTINGS ==
    setVolume(vol) {
        this.data.settings.volume = Math.max(0, Math.min(1, vol));
        this.save();
    }

    toggleScreenShake() {
        this.data.settings.screenShake = !this.data.settings.screenShake;
        this.save();
        return this.data.settings.screenShake;
    }

    unlockAchievement(achievementId) {
        if (!this.data.achievements.includes(achievementId)) {
            this.data.achievements.push(achievementId);
            this.save();
        }
    }

    areAllCharsUnlocked() {
        return CONFIG.player.every(char => this.isCharUnlocked(char.key));
    }

    hasWonWithAllCharacters(lastPlayedChar) {
        const wins = this.data.wins || {};
        wins[lastPlayedChar] = true;
        this.data.wins = wins;
        this.save();

        return CONFIG.player.every(char => wins[char.key]);
    }
}
