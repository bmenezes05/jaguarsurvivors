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
        allowedStructures: ['structure_barricada', 'structure_barricada_grande', 'structure_barricada_grande2', 'structure_barricada2', 'structure_cone', 'structure_paredao'],
        music: 'cinematic1',
        waves: [
            // 0-2 min: Introdução
            {
                name: 'A FAVELA',
                duration: 120,
                interval: 5000,
                enemiesPerWave: 1,
                enemyTypes: ['enemy_favela_basico', 'enemy_favela', 'enemy_cria', 'enemy_cria2', 'enemy_mendigo', 'enemy_mandraka', 'enemy_bolsa_familia'],
                totalEnemies: 9999,
                spawnDistance: 700,
                maxOnScreen: 30
            },

            //2-4 min: Escalada
            {
                name: 'FUNKEIROS E INFLUENCERS',
                duration: 120,
                interval: 4000,
                enemiesPerWave: 1,
                enemyTypes: ['enemy_funkeiro', 'enemy_funkeiro2', 'enemy_funkeiro3', 'enemy_influencer', 'enemy_influencer2', 'enemy_cria', 'enemy_favela_basico', 'enemy_favela'],
                totalEnemies: 9999,
                spawnDistance: 700,
                maxOnScreen: 45
            },

            // 4-6 min: Perigo
            {
                name: 'MILICIA E CRIMINALIDADE',
                duration: 120,
                interval: 3000,
                enemiesPerWave: 1,
                enemyTypes: ['enemy_milicia', 'enemy_milicia2', 'enemy_milicia3', 'enemy_crime4', 'enemy_favela_basico', 'enemy_cria2'],
                totalEnemies: 9999,
                spawnDistance: 700,
                maxOnScreen: 60
            },

            // 6-8 min: Tensão
            {
                name: 'GUERRA DE FACÇÕES',
                duration: 120,
                interval: 3000,
                enemiesPerWave: 2,
                enemyTypes: ['enemy_elite_bandido', 'enemy_bandido_moto', 'enemy_crime', 'enemy_crime2', 'enemy_crime3', 'enemy_crime5'],
                totalEnemies: 9999,
                spawnDistance: 700,
                maxOnScreen: 80
            },

            // 8-10 min: Caos Total
            {
                name: 'O CAOS SE INSTALA',
                duration: 120,
                interval: 3000,
                enemiesPerWave: 2,
                enemyTypes: ['enemy_cria', 'enemy_cria2', 'enemy_crime3', 'enemy_crime4', 'enemy_crime5', 'enemy_funkeiro3'],
                totalEnemies: 9999,
                spawnDistance: 700,
                maxOnScreen: 120
            }
        ],
        suddenDeath: {
            interval: 5000,
            buffPercent: 0.15
        },
        boss: 'boss_bandido_moto',
        duration: 600,
        events: [
            { time: 300, type: 'boss_spawn', key: 'boss_bandido_moto' }, // Mini-boss na metade
            { time: 150, type: 'boss_spawn', key: 'boss_bandido_moto' }, // Boss Final
            { time: 60, type: 'final_hour' }
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
        allowedStructures: ['barrel_explosive', 'structure_rock_2'],
        music: 'cinematic2',
        waves: [
            { interval: 3000, enemiesPerWave: 2, enemyTypes: ['enemy_centrao'], totalEnemies: 20, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 2500, enemiesPerWave: 3, enemyTypes: ['enemy_centrao', 'enemy_common_2'], totalEnemies: 40, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 2000, enemiesPerWave: 3, enemyTypes: ['enemy_centrao', 'enemy_politico', 'enemy_elite_congresso_1'], totalEnemies: 50, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1500, enemiesPerWave: 4, enemyTypes: ['enemy_politico', 'enemy_common_2', 'enemy_elite_congresso_3'], totalEnemies: 60, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1000, enemiesPerWave: 5, enemyTypes: ['enemy_politico', 'enemy_centrao', 'enemy_elite_congresso_2'], totalEnemies: 80, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 800, enemiesPerWave: 6, enemyTypes: ['enemy_centrao', 'enemy_politico', 'enemy_common_2', 'enemy_elite_congresso_1', 'enemy_elite_congresso_2'], totalEnemies: 100, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 }
        ],
        boss: 'boss_karl_marx',
        duration: 180,
        events: [
            { time: 180, type: 'boss_spawn', key: 'boss_karl_marx' },
            { time: 60, type: 'final_hour' }
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
            { interval: 3000, enemiesPerWave: 1, enemyTypes: ['enemy_bolsonarista'], totalEnemies: 20, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 2500, enemiesPerWave: 2, enemyTypes: ['enemy_bolsonarista', 'enemy_common_3'], totalEnemies: 40, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 2000, enemiesPerWave: 2, enemyTypes: ['enemy_bolsonarista', 'enemy_bolsonarista2', 'enemy_elite_avenida_1'], totalEnemies: 50, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1500, enemiesPerWave: 3, enemyTypes: ['enemy_petista', 'enemy_common_3', 'enemy_elite_avenida_3'], totalEnemies: 60, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1000, enemiesPerWave: 4, enemyTypes: ['enemy_partido_amarelo', 'enemy_elite_avenida_2'], totalEnemies: 80, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 800, enemiesPerWave: 5, enemyTypes: ['enemy_bolsonarista', 'enemy_petista', 'enemy_common_3', 'enemy_elite_avenida_1', 'enemy_elite_avenida_2'], totalEnemies: 100, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 }
        ],
        boss: 'boss_venus',
        duration: 180,
        events: [
            { time: 180, type: 'boss_spawn', key: 'boss_venus' },
            { time: 60, type: 'final_hour' }
        ]
    },
    {
        id: 'universidade',
        name: 'Universidade Pública',
        description: 'A doutrinação do povo.',
        background: {
            inner: 'src/assets/images/bg_avenida.png',
            outside: 'src/assets/images/bg_avenida_outside.png'
        },
        allowedStructures: ['structure_crystal'],
        music: 'cinematic4',
        waves: [
            { interval: 3000, enemiesPerWave: 1, enemyTypes: ['enemy_common_crystal_1'], totalEnemies: 20, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 2500, enemiesPerWave: 2, enemyTypes: ['enemy_common_crystal_1', 'enemy_common_crystal_2'], totalEnemies: 30, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 2000, enemiesPerWave: 2, enemyTypes: ['enemy_common_crystal_3', 'enemy_elite_crystal_1'], totalEnemies: 40, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1500, enemiesPerWave: 3, enemyTypes: ['enemy_common_crystal_4', 'enemy_common_crystal_5'], totalEnemies: 50, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 1000, enemiesPerWave: 4, enemyTypes: ['enemy_common_crystal_1', 'enemy_common_crystal_2', 'enemy_elite_crystal_2'], totalEnemies: 60, bossPerWave: 0, spawnDistance: 700, maxOnScreen: 50 },
            { interval: 800, enemiesPerWave: 5, enemyTypes: ['enemy_common_crystal_3', 'enemy_elite_crystal_1', 'enemy_elite_crystal_3'], totalEnemies: 80, bossPerWave: 1, spawnDistance: 700, maxOnScreen: 50 }
        ],
        boss: 'boss_crystal_golem',
        duration: 180,
        events: [
            { time: 180, type: 'boss_spawn', key: 'boss_crystal_golem' },
            { time: 60, type: 'final_hour' }
        ]
    }
];
