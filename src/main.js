import { PreloadScene } from './scenes/preloadScene.js';
import { BootScene } from './scenes/bootScene.js';
import { GameScene } from './scenes/gameScene.js';
import { CONFIG } from './config/config.js';
import { SaveManager } from './managers/saveManager.js';
import { AchievementManager } from './managers/achievementManager.js';

export const GameEvents = {
    gameInstance: null,
    saveManager: null,
    achievementManager: null,

    // == NAVIGATION ==
    goToCharSelect: () => {
        GameEvents.hideAllOverlays();
        if (GameEvents.gameInstance) {
            GameEvents.gameInstance.sound.stopAll();
            GameEvents.gameInstance.scene.stop('GameScene');
        }
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('map-select').classList.remove('active');
        document.getElementById('char-select').classList.add('active');
        GameEvents.generateCharacterSelection();
    },
    goToMainMenu: () => {
        GameEvents.hideAllOverlays();
        if (GameEvents.gameInstance) {
            GameEvents.gameInstance.sound.stopAll();
            GameEvents.gameInstance.scene.stop('GameScene');
        }
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('map-select').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    },
    goToShop: () => {
        GameEvents.hideAllOverlays();
        document.getElementById('meta-shop').classList.add('active');
        GameEvents.generateShop();
    },
    goToSettings: () => {
        GameEvents.hideAllOverlays();
        document.getElementById('settings-menu').classList.add('active');
        GameEvents.updateSettingsUI();
    },
    hideAllOverlays: () => {
        const overlays = document.querySelectorAll('.overlay-screen');
        overlays.forEach(el => el.classList.remove('active'));

        // Also clean up dynamic overlays
        const upgradeOverlay = document.getElementById('upgrade-overlay');
        if (upgradeOverlay) upgradeOverlay.remove();
    },

    startGame: (charType) => {
        GameEvents.selectedChar = charType;
        GameEvents.hideAllOverlays();
        document.getElementById('weapon-select').classList.add('active');
        GameEvents.generateWeaponSelection();
    },

    selectWeapon: (weaponKey) => {
        GameEvents.selectedWeapon = weaponKey;
        GameEvents.hideAllOverlays();
        document.getElementById('map-select').classList.add('active');
        GameEvents.generateMapSelection();
    },

    generateMapSelection: () => {
        const container = document.getElementById('map-container');
        container.innerHTML = '';

        CONFIG.maps.forEach(map => {
            const card = document.createElement('div');
            card.classList.add('map-card');

            // Find if there's a record or something (future proofing)
            const mapStatus = "MISSAO DISPONÍVEL";

            card.innerHTML = `
                <div class="map-badge">MAPA</div>
                <div class="map-preview">
                    <img src="${map.background.inner}" alt="${map.name}">
                </div>
                <div class="map-card-content">
                    <h3>${map.name}</h3>
                    <p>${map.description}</p>
                    <div class="map-status">${mapStatus}</div>
                </div>
            `;

            card.onclick = () => {
                // Play sound if possible
                const bootScene = GameEvents.gameInstance.scene.getScene('BootScene');
                if (bootScene && bootScene.sound) {
                    bootScene.sound.play('menuclick');
                }

                GameEvents.launchGame(map.id);
            };

            container.appendChild(card);
        });
    },

    launchGame: (mapId) => {
        GameEvents.hideAllOverlays();
        // Hide HUD until actual game starts
        document.getElementById('game-ui').style.display = 'none';

        GameEvents.gameInstance.scene.start('GameScene', {
            charType: GameEvents.selectedChar,
            primaryWeapon: GameEvents.selectedWeapon,
            mapId: mapId
        });
    },

    resumeGame: () => {
        const gameScene = GameEvents.gameInstance.scene.getScene('GameScene');
        if (gameScene && gameScene.bootstrap && gameScene.bootstrap.uiFlow) {
            gameScene.bootstrap.uiFlow.togglePause();
        }
    },

    // == SHOP LOGIC ==
    generateShop: () => {
        const container = document.getElementById('shop-container');
        const coinsDisplay = document.getElementById('shop-coins-display');
        container.innerHTML = '';

        const coins = GameEvents.saveManager.data.coins;
        coinsDisplay.textContent = `Moedas: ${coins}`;

        CONFIG.metaShop.forEach(item => {
            const currentRank = GameEvents.saveManager.getUpgradeRank(item.id) || 0;
            const cost = Math.floor(item.costBase * Math.pow(item.costScaling, currentRank));
            const isMaxed = currentRank >= item.maxRank;

            const card = document.createElement('div');
            card.classList.add('shop-card');

            // Visual feedback for affordability/maxed
            if (isMaxed) card.classList.add('maxed');
            else if (coins < cost) card.classList.add('locked');

            card.innerHTML = `
                <div class="shop-icon">${item.icon}</div>
                <div class="shop-info">
                    <h3>${item.name} <span class="rank-badge">Lvl ${currentRank}/${item.maxRank}</span></h3>
                    <p>${item.description}</p>
                    <button class="btn-buy" ${isMaxed || coins < cost ? 'disabled' : ''} 
                        onclick="GameEvents.buyUpgrade('${item.id}')">
                        ${isMaxed ? 'MAX' : `💰 ${cost}`}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    buyUpgrade: (id) => {
        const item = CONFIG.metaShop.find(x => x.id === id);
        if (!item) return;

        const currentRank = GameEvents.saveManager.getUpgradeRank(id) || 0;
        if (currentRank >= item.maxRank) return;

        const cost = Math.floor(item.costBase * Math.pow(item.costScaling, currentRank));

        if (GameEvents.saveManager.spendCoins(cost)) {
            GameEvents.saveManager.upgradeMeta(id);
            GameEvents.generateShop(); // Refresh UI
        }
    },

    // == SETTINGS LOGIC ==
    updateSettingsUI: () => {
        const s = GameEvents.saveManager.data.settings;
        document.getElementById('setting-volume').value = s.volume * 100;
        document.getElementById('setting-shake').checked = s.screenShake;
    },

    setVolume: (val) => {
        const vol = val / 100;
        GameEvents.saveManager.setVolume(vol);
        // Apply instantly if GameScene is running or audio manager exists
        const scene = GameEvents.gameInstance.scene.getScene('BootScene');
        if (scene && scene.audio) {
            // Updating global volume logic would go here
            // scene.audio.setGlobalVolume(vol);
        }
    },

    toggleShake: () => {
        GameEvents.saveManager.toggleScreenShake();
    },

    generateWeaponSelection: () => {
        const weaponContainer = document.getElementById('weapon-container');
        const detailPane = document.getElementById('weapon-detail-pane');
        weaponContainer.innerHTML = '';
        detailPane.innerHTML = '<div class="detail-placeholder">SELECIONE UMA ARMA AO LADO</div>';

        // Get all primary weapons
        const primaryWeapons = CONFIG.weapon.filter(w => w.slotType === 'primary');

        primaryWeapons.forEach((weapon, index) => {
            const miniCard = document.createElement('div');
            miniCard.classList.add('weapon-card-mini');

            let emoji = weapon.type === 'melee' ? '⚔️' : (weapon.type === 'ranged' ? '🎯' : '✨');
            let typeName = weapon.type === 'melee' ? 'CORPO A CORPO' : (weapon.type === 'ranged' ? 'À DISTÂNCIA' : 'RASTRO');

            miniCard.innerHTML = `
                <img src="${weapon.image}" onerror="this.src='src/assets/images/weapon_sword.png'">
                <div class="mini-info">
                    <h4>${weapon.name}</h4>
                    <span class="mini-type">${emoji} ${typeName}</span>
                </div>
            `;

            miniCard.onclick = () => {
                // Select visual feedback
                document.querySelectorAll('.weapon-card-mini').forEach(c => c.classList.remove('active'));
                miniCard.classList.add('active');

                // Show detailed preview
                GameEvents.showWeaponDetail(weapon);

                // Play sound
                const bootScene = GameEvents.gameInstance.scene.getScene('BootScene');
                if (bootScene && bootScene.sound) {
                    bootScene.sound.play('menuclick');
                }
            };

            weaponContainer.appendChild(miniCard);

            // Auto-select first weapon
            if (index === 0) miniCard.click();
        });
    },

    showWeaponDetail: (weapon) => {
        const detailPane = document.getElementById('weapon-detail-pane');

        const damage = weapon.baseStats?.damage || 0;
        const cooldown = weapon.baseStats?.cooldown || 1000;
        const attackSpeed = (1000 / cooldown).toFixed(1);
        const knockback = weapon.baseStats?.knockback || 0;

        detailPane.innerHTML = `
            <div class="detail-header">
                <div class="detail-visual-bg"></div>
                <div class="detail-visual">
                    <img src="${weapon.image}" onerror="this.src='src/assets/images/weapon_sword.png'">
                </div>
            </div>
            <div class="detail-info">
                <h2>${weapon.name}</h2>
                <p class="detail-description">"${weapon.description || 'Uma ferramenta de destruição versátil para sua missão.'}"</p>
                
                <div class="detail-stats-grid">
                    <div class="detail-stat-card">
                        <span class="label">ESTIMATIVA DE DANO</span>
                        <span class="value">💥 ${damage}</span>
                    </div>
                    <div class="detail-stat-card">
                        <span class="label">ATAQUE POR SEGUNDO</span>
                        <span class="value">⚡ ${attackSpeed}/s</span>
                    </div>
                    <div class="detail-stat-card">
                        <span class="label">FORÇA DE RECUO</span>
                        <span class="value">🛡️ ${knockback}</span>
                    </div>
                    <div class="detail-stat-card">
                        <span class="label">CATEGORIA</span>
                        <span class="value">${weapon.type.toUpperCase()}</span>
                    </div>
                </div>

                <button class="btn btn-equip" onclick="GameEvents.selectWeapon('${weapon.key}')">
                    ESCOLHER ESTA ARMA
                </button>
            </div>
        `;
    },

    generateCharacterSelection: () => {
        const charContainer = document.getElementById('char-container');
        charContainer.innerHTML = '';

        const unlocked = GameEvents.saveManager?.data?.unlockedChars || CONFIG.player.map(p => p.key);

        CONFIG.player.forEach((char) => {
            const isUnlocked = unlocked.includes(char.key);
            const charCard = document.createElement('div');
            charCard.classList.add('char-card');
            if (!isUnlocked) charCard.classList.add('locked');

            charCard.onclick = () => {
                if (isUnlocked) {
                    const bootScene = GameEvents.gameInstance.scene.getScene('BootScene');
                    if (bootScene && bootScene.sound) bootScene.sound.play('menuclick');
                    GameEvents.startGame(char.key);
                }
            };

            const s = char.stats || {};
            const hpWidth = Math.min(100, (char.health / 150) * 100);
            const spdWidth = Math.min(100, (s.moveSpeed || 1.0) * 70);
            const dmgWidth = Math.min(100, (s.damage || 1.0) * 60);


            const traitsHtml = (char.traits || []).map(t => `<span class="${t.good ? 'trait-good' : 'trait-bad'}">${t.text}</span>`).join('');

            charCard.innerHTML = `
                <div class="char-header">
                    <div class="char-placeholder-img">
                        <img src="${char.player_body_image}" alt="${char.name}">
                    </div>
                </div>
                <div class="char-info">
                    <h3>${char.name}</h3>
                    <p class="char-description">${char.description || 'Personagem misterioso'}</p>
                    
                    <div class="char-stat-bars">
                        <div class="stat-bar-row">
                            <div class="stat-label"><span>SAÚDE</span> <span>${char.health}</span></div>
                            <div class="stat-bar-bg"><div class="stat-bar-fill hp" style="width: ${hpWidth}%"></div></div>
                        </div>
                        <div class="stat-bar-row">
                            <div class="stat-label"><span>VELOCIDADE</span> <span>${Math.round((s.moveSpeed || 1) * 100)}%</span></div>
                            <div class="stat-bar-bg"><div class="stat-bar-fill spd" style="width: ${spdWidth}%"></div></div>
                        </div>
                        <div class="stat-bar-row">
                            <div class="stat-label"><span>PODER</span> <span>${Math.round((s.damage || 1) * 100)}%</span></div>
                            <div class="stat-bar-bg"><div class="stat-bar-fill dmg" style="width: ${dmgWidth}%"></div></div>
                        </div>
                    </div>

                    <div class="char-traits">
                        ${traitsHtml}
                    </div>
                </div>
            `;
            charContainer.appendChild(charCard);
        });
    }
};

window.GameEvents = GameEvents;

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
            debugBodyColor: 0x00ff00
        }
    },
    render: { pixelArt: false, antialias: true },
    scene: [PreloadScene, BootScene, GameScene]
};

window.onload = () => {
    const game = new Phaser.Game(gameConfig);
    GameEvents.gameInstance = game;
    // Init Managers
    GameEvents.saveManager = SaveManager.getInstance();
    GameEvents.achievementManager = new AchievementManager();

    // Check global unlocks on startup
    GameEvents.achievementManager.checkGlobalUnlocks();

    GameEvents.generateCharacterSelection();
};