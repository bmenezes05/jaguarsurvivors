
export class LegendarySelectionUIManager {
    constructor(scene) {
        this.scene = scene;
        this.container = this.createContainer();
    }

    createContainer() {
        const div = document.createElement('div');
        div.id = 'legendary-selection';
        div.style.position = 'absolute';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.backgroundColor = 'rgba(20, 0, 0, 0.9)'; // Dark Red/Black
        div.style.display = 'none';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        div.style.zIndex = '2000'; // Above everything
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.color = '#FFD700'; // Gold

        const title = document.createElement('h1');
        title.innerText = 'RECOMPENSA LENDÁRIA';
        title.style.fontSize = '3rem';
        title.style.textShadow = '0 0 20px #FF4500'; // Orange flow
        title.style.marginBottom = '50px';
        title.style.textTransform = 'uppercase';
        title.style.letterSpacing = '5px';
        div.appendChild(title);

        const cardsContainer = document.createElement('div');
        cardsContainer.id = 'legendary-cards';
        cardsContainer.style.display = 'flex';
        cardsContainer.style.gap = '30px';
        div.appendChild(cardsContainer);

        document.body.appendChild(div);
        return div;
    }

    show(rewards) {
        const cardsContainer = this.container.querySelector('#legendary-cards');
        cardsContainer.innerHTML = ''; // Clear prev

        rewards.forEach(reward => {
            const card = document.createElement('div');
            card.className = 'legendary-card';

            card.style.width = '250px';
            card.style.height = '350px';
            card.style.backgroundColor = '#2a0a0a';
            card.style.border = '2px solid #FFD700';
            card.style.borderRadius = '15px';
            card.style.padding = '20px';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';
            card.style.cursor = 'pointer';
            card.style.transition = 'transform 0.2s, box-shadow 0.2s';
            card.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';

            // Hover effect logic handled via JS or separate CSS class? 
            // Let's add simple JS hover
            card.onmouseenter = () => {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)';
            };
            card.onmouseleave = () => {
                card.style.transform = 'scale(1.0)';
                card.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';
            };

            card.innerHTML = `
                <div class="legendary-card-icon">${reward.icon}</div>
                <div class="legendary-card-type">${reward.type.toUpperCase()}</div>
                <h2 class="legendary-card-title">${reward.name}</h2>
                <p class="legendary-card-description">${reward.description}</p>
            `;

            card.onclick = () => {
                this.selectReward(reward);
            };

            cardsContainer.appendChild(card);
        });

        this.container.style.display = 'flex';

        // Simple entry animation
        this.container.style.opacity = '0';
        requestAnimationFrame(() => {
            this.container.style.transition = 'opacity 0.5s';
            this.container.style.opacity = '1';
        });
    }

    hide() {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 500);
    }

    selectReward(reward) {
        this.scene.legendaryRewardManager.applyReward(reward.id);
        this.hide();
        this.scene.scene.resume(); // Correct Phaser API
    }
}
