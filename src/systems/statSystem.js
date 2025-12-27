export class Stat {
    constructor(baseValue) {
        this.baseValue = baseValue;
        this.flatBonus = 0;
        this.totalMultiplier = 1.0;
    }

    addFlat(value) {
        this.flatBonus += value;
    }

    addMultiplier(value) {
        // Assuming value is like 0.15 for +15%
        this.totalMultiplier += value;
    }

    getValue() {
        return (this.baseValue + this.flatBonus) * this.totalMultiplier;
    }

    reset() {
        this.flatBonus = 0;
        this.totalMultiplier = 1.0;
    }
}
