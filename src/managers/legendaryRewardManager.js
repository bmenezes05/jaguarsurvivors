import { CONFIG } from '../config/config.js';

export class LegendaryRewardManager {
    constructor(scene) {
        this.scene = scene;
        this.activeRewards = []; // IDs of rewards player has
    }

    getRandomRewards(count = 3) {
        // Filter out unique rewards already obtained (if we want them unique)
        // For now, let's allow stacking or just uniques. Assuming unique for "Legendary".
        const available = CONFIG.legendary.filter(r => !this.activeRewards.includes(r.id));

        // Shuffle and slice
        const shuffled = available.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    applyReward(id) {
        const reward = CONFIG.legendary.find(r => r.id === id);
        if (!reward) return;

        this.activeRewards.push(id);

        if (reward.type === 'gadget') {
            this.scene.gadgetManager.addGadget(reward.id, reward.config);
        } else if (reward.type === 'proc') {
            this.scene.procManager.addProc(reward.id, reward.config);
        } else if (reward.type === 'companion') {
            // Future implementation
        }

        this.scene.events.emit('legendary-obtained', reward);
        console.debug("EVENT_EMITTED", { eventName: 'legendary-obtained', payload: reward });
    }
}
