import { BASE_CONFIG } from '../config/config.js';

export class PreloadScene extends Phaser.Scene {
    constructor() { super({ key: 'PreloadScene' }); }

    preload() {

        for (let i = 0; i < BASE_CONFIG.player.length; i++) {
            const player = BASE_CONFIG.player[i];
            if (player.player_body_image) this.load.image(player.key, player.player_body_image);
            if (player.player_legs_image) this.load.image(player.key + '_legs', player.player_legs_image);
        }

        for (let i = 0; i < BASE_CONFIG.weapon.length; i++) {
            const weapon = BASE_CONFIG.weapon[i];
            if (weapon.image) this.load.image(weapon.key, weapon.image);
        }

        for (let i = 0; i < BASE_CONFIG.enemy.length; i++) {
            const enemy = BASE_CONFIG.enemy[i];
            if (enemy.enemy_body_image) this.load.image(enemy.key, enemy.enemy_body_image);
            if (enemy.enemy_legs_image) this.load.image(enemy.key + '_legs', enemy.enemy_legs_image);
        }

        for (let i = 0; i < BASE_CONFIG.xp.gems.length; i++) {
            const xp = BASE_CONFIG.xp.gems[i];
            if (xp.image) this.load.image(xp.key, xp.image);
        }

        // Load pickup sprites for sprite-based icons
        const pickupSprites = ['pickup_bomb', 'pickup_cure', 'pickup_shield', 'pickup_speedboots'];
        pickupSprites.forEach(key => {
            this.load.image(key, `src/assets/images/${key}.png`);
        });

        // Load item sprites for equipable items
        const itemSprites = ['item_bomb', 'item_boots', 'item_cape', 'item_chain',
            'item_chain_justice', 'item_crown', 'item_glasses', 'item_gloves'];
        itemSprites.forEach(key => {
            this.load.image(key, `src/assets/images/${key}.png`);
        });

        // Load Projectile Sprites
        if (BASE_CONFIG.projectiles) {
            BASE_CONFIG.projectiles.forEach(proj => {
                if (proj.image) this.load.image(proj.key, proj.image);
            });
        }

        // Load Map Backgrounds
        BASE_CONFIG.maps.forEach(map => {
            if (map.background.inner) this.load.image(`bg_${map.id}_inner`, map.background.inner);
            if (map.background.outside) this.load.image(`bg_${map.id}_outside`, map.background.outside);
        });

        // Carrega áudios do sistema
        Object.entries(BASE_CONFIG.audio).forEach(([key, path]) => {
            this.load.audio(key, path);
        });

        // Barra de carregamento simples
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'CARREGANDO...', {
            fontFamily: 'Anton', fontSize: '32px', fill: '#FFD700'
        }).setOrigin(0.5);
    }

    create() {
        // Generate shadow texture
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x000000, 0.4);
        graphics.fillEllipse(32, 32, 64, 32);
        graphics.generateTexture('shadow', 64, 64);
        graphics.destroy();

        // Vai para a cena de boot/menu
        this.scene.start('BootScene');
    }
}