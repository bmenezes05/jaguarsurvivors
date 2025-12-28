import { CONFIG } from '../config/config.js';

export class MapSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapSelectionScene' });
    }

    init(data) {
        this.selectedChar = data.charType;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);

        // Title
        this.add.text(width / 2, 80, 'ESCOLHA O CAMPO DE BATALHA', {
            fontFamily: 'Anton',
            fontSize: '48px',
            fill: '#FFD700'
        }).setOrigin(0.5);

        const mapWidth = 300;
        const spacing = 40;
        const totalWidth = (mapWidth * CONFIG.maps.length) + (spacing * (CONFIG.maps.length - 1));
        const startX = (width - totalWidth) / 2 + mapWidth / 2;

        CONFIG.maps.forEach((map, index) => {
            const x = startX + (index * (mapWidth + spacing));
            const y = height / 2;

            this.createMapCard(x, y, map);
        });

        // Back button
        const backBtn = this.add.text(width / 2, height - 80, 'VOLTAR', {
            fontFamily: 'Anton',
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setFill('#FF4444'));
        backBtn.on('pointerout', () => backBtn.setFill('#FFFFFF'));
        backBtn.on('pointerdown', () => {
            document.getElementById('game-ui').style.display = 'none';
            window.GameEvents.goToCharSelect();
        });
    }

    createMapCard(x, y, map) {
        const width = 300;
        const height = 400;

        // Container card
        const card = this.add.container(x, y);

        // Background panel
        const panel = this.add.rectangle(0, 0, width, height, 0x222222)
            .setStrokeStyle(4, 0x444444)
            .setInteractive({ useHandCursor: true });

        // Placeholder Image (Map Preview)
        // We use the inner background image as a preview, scaled down
        const preview = this.add.image(0, -60, `bg_${map.id}_inner`)
            .setDisplaySize(260, 180);

        // Map Name
        const name = this.add.text(0, 60, map.name, {
            fontFamily: 'Anton',
            fontSize: '28px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Map Description
        const desc = this.add.text(0, 120, map.description, {
            fontFamily: 'Roboto',
            fontSize: '16px',
            fill: '#AAAAAA',
            align: 'center',
            wordWrap: { width: 260 }
        }).setOrigin(0.5);

        card.add([panel, preview, name, desc]);

        // Interactivity
        panel.on('pointerover', () => {
            panel.setStrokeStyle(4, 0xFFD700);
            card.setScale(1.05);
        });

        panel.on('pointerout', () => {
            panel.setStrokeStyle(4, 0x444444);
            card.setScale(1.0);
        });

        panel.on('pointerdown', () => {
            this.sound.play('menuclick');
            this.scene.start('GameScene', {
                charType: this.selectedChar,
                mapId: map.id
            });
        });
    }
}
