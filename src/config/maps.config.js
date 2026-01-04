/**
 * Maps Configuration
 * 
 * Contains all map/stage definitions including waves, bosses,
 * backgrounds, and timed events.
 */

export const mapsConfig = [
    {
        id: 'favela',
        name: 'Favela',
        description: 'A desfavelização do Brasil.',
        background: {
            inner: 'src/assets/images/bg_favela.png',
            outside: 'src/assets/images/bg_favela_outside.png'
        },
        allowedStructures: ['crate_wood'],
        music: 'cinematic1',
        waves: [
            { interval: 2000, enemiesPerWave: 1, enemyTypes: ['enemy_favela_basico'], totalEnemies: 10, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 500 },
            { interval: 1500, enemiesPerWave: 2, enemyTypes: ['enemy_bandido', 'enemy_bandido2'], totalEnemies: 30, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 500 },
            { interval: 1000, enemiesPerWave: 3, enemyTypes: ['enemy_favela'], totalEnemies: 50, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 500 },
            { interval: 500, enemiesPerWave: 4, enemyTypes: ['enemy_favela'], totalEnemies: 100, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 500 }
        ],
        suddenDeath: {
            interval: 10000,
            buffPercent: 0.10
        },
        boss: 'boss_bandido_moto',
        duration: 300,
        events: [
            { time: 210, type: 'boss_spawn', key: 'boss_bandido_moto' },
            { time: 45, type: 'final_hour' }
        ]
    },
    {
        id: 'congresso',
        name: 'Congresso',
        description: 'A luta contra o centrão.',
        background: {
            inner: 'src/assets/images/bg_congresso.png',
            outside: 'src/assets/images/bg_congresso_outside.png'
        },
        allowedStructures: ['barrel_explosive'],
        music: 'cinematic2',
        waves: [
            { interval: 1500, enemiesPerWave: 2, enemyTypes: ['enemy_centrao'], totalEnemies: 20, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1000, enemiesPerWave: 3, enemyTypes: ['enemy_centrao', 'enemy_politico'], totalEnemies: 40, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 800, enemiesPerWave: 4, enemyTypes: ['enemy_politico'], totalEnemies: 60, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 500, enemiesPerWave: 5, enemyTypes: ['enemy_politico', 'enemy_centrao'], totalEnemies: 100, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 }
        ],
        boss: 'boss_karl_marx',
        duration: 300,
        events: [
            { time: 210, type: 'boss_spawn', key: 'boss_karl_marx' },
            { time: 45, type: 'final_hour' }
        ]
    },
    {
        id: 'avenida',
        name: 'Manifestações',
        description: 'A desalienação do povo.',
        background: {
            inner: 'src/assets/images/bg_avenida.png',
            outside: 'src/assets/images/bg_avenida_outside.png'
        },
        allowedStructures: ['crate_wood', 'barrel_explosive'],
        music: 'cinematic3',
        waves: [
            { interval: 2000, enemiesPerWave: 1, enemyTypes: ['enemy_bolsonarista'], totalEnemies: 20, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1500, enemiesPerWave: 2, enemyTypes: ['enemy_bolsonarista', 'enemy_bolsonarista2'], totalEnemies: 40, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1200, enemiesPerWave: 3, enemyTypes: ['enemy_petista'], totalEnemies: 60, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 800, enemiesPerWave: 4, enemyTypes: ['enemy_partido_amarelo'], totalEnemies: 100, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 }
        ],
        boss: 'boss_tia_zap',
        duration: 300,
        events: [
            { time: 210, type: 'boss_spawn', key: 'boss_tia_zap' },
            { time: 45, type: 'final_hour' }
        ]
    }
];
