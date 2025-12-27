export class UpgradeUIManager {
    constructor(scene) {
        this.scene = scene;
        this.root = null;
    }

    show() {
        const upgrades = this.scene.upgradeManager.getSmartUpgradeOptions(3);

        // Pause Phaser
        this.scene.scene.pause();

        // Root overlay
        this.root = document.createElement('div');
        this.root.id = 'upgrade-overlay';

        // Title
        const title = document.createElement('h1');
        title.innerText = 'ESCOLHA UMA MELHORIA';
        title.className = 'upgrade-title';
        this.root.appendChild(title);

        // Cards container
        const cards = document.createElement('div');
        cards.className = 'upgrade-cards';

        upgrades.forEach(upgrade => {
            cards.appendChild(this.createCard(upgrade));
        });

        this.root.appendChild(cards);
        document.body.appendChild(this.root);
    }

    createCard(upgrade) {
        const card = document.createElement('div');
        card.className = 'upgrade-card';

        if (upgrade.isEvolution) {
            card.classList.add('evolution');
        }

        // Icon (sprite or emoji fallback)
        const icon = document.createElement('div');
        icon.className = 'upgrade-icon';

        if (upgrade.spriteKey) {
            icon.style.backgroundImage = `url(src/assets/images/${upgrade.spriteKey}.png)`;
        } else {
            icon.innerText = upgrade.icon || '⭐';
        }

        // Name
        const name = document.createElement('h2');
        name.innerText = upgrade.name;

        // Description
        const desc = document.createElement('p');
        desc.innerText = upgrade.desc;

        // Type label
        const type = document.createElement('span');
        type.className = 'upgrade-type';
        type.innerText = this.getTypeLabel(upgrade);

        card.append(icon, name, desc, type);

        card.onclick = () => this.selectUpgrade(upgrade);

        return card;
    }

    getTypeLabel(upgrade) {
        if (upgrade.isEvolution) return 'EVOLUÇÃO';
        if (upgrade.type === 'new_weapon') return 'NOVA ARMA';
        if (upgrade.type === 'levelup_weapon') return 'LEVEL UP';
        if (upgrade.type === 'new_item') return 'NOVO ITEM';
        if (upgrade.type === 'levelup_item') return 'LEVEL UP';
        return 'PASSIVO';
    }

    selectUpgrade(upgrade) {
        this.scene.upgradeManager.applyUpgrade(upgrade);
        this.hide();
    }

    hide() {
        if (this.root) {
            this.root.remove();
            this.root = null;
        }

        this.scene.scene.resume();
    }
}
