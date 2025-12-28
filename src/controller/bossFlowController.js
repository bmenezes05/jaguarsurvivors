import { CONFIG } from '../config/config.js';

/**
 * BossFlowController
 * Responsabilidade: Gerenciar o ciclo de vida, fases e estados dos Chefes.
 * Suporta múltiplos chefes simultâneos.
 */
export class BossFlowController {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;

        this.bossUI = scene.bossUIManager;
        this.legendaryUI = scene.legendaryUIManager;
        this.legendaryRewardManager = scene.legendaryRewardManager;

        this.activeBosses = []; // Array para múltiplos chefes
    }

    /**
     * Inicia o spawn de um boss.
     * @param {string} bossKey Chave do boss em CONFIG.bosses
     */
    spawn(bossKey) {
        const bossDef = CONFIG.bosses.find(b => b.key === bossKey) || CONFIG.bosses[0];
        const baseEnemy = CONFIG.enemy.find(e => e.key === bossDef.baseEnemy) || CONFIG.enemy[0];

        // Merge de configuração para criar o Boss
        const finalBossConfig = {
            ...baseEnemy,
            ...bossDef,
            health: baseEnemy.health * (bossDef.healthMultiplier || 10),
            damage: baseEnemy.damage * (bossDef.damageMultiplier || 1.5),
            speed: baseEnemy.speed * (bossDef.speedMultiplier || 0.8),
            size: baseEnemy.size * (bossDef.sizeMultiplier || 1.5),
            isBoss: true,
            bossData: bossDef
        };

        // Recalcula escala baseada no multiplicador de tamanho
        const scale = (finalBossConfig.size / baseEnemy.size) * (baseEnemy.bodyScale || 0.4);
        finalBossConfig.bodyScale = scale;
        finalBossConfig.legsScale = scale;

        // Solicita ao Spawner a criação física
        const bossEntity = this.scene.enemySpawner.spawnEntity(finalBossConfig);

        // Adiciona à lista de ativos
        this.activeBosses.push(bossEntity);

        // Notifica sistemas (UI, Câmera, Audio) via evento central
        console.debug("EVENT_EMITTED", { eventName: 'boss-spawned', payload: bossEntity });
        this.events.emit('boss-spawned', bossEntity);
    }

    /**
     * Chamado quando um boss morre.
     */
    onBossDied(x, y) {
        // Encontra o boss morto na lista e remove
        // Nota: O evento 'boss-died' na GameEventHandler passa x, y.
        // Precisamos identificar QUAL boss morreu.
        // Como o spawner limpa inimigos inativos, podemos filtrar aqui.
        this.activeBosses = this.activeBosses.filter(b => b.isActive && b.health > 0);

        if (this.activeBosses.length === 0) {
            this.bossUI.hide();
        }

        // Fluxo de recompensa (sempre que um chefe morre)
        const rewards = this.legendaryRewardManager.getRandomRewards();
        this.scene.scene.pause(); // Pause gameplay during legendary selection
        this.legendaryUI.show(rewards);

        console.debug("EVENT_EMITTED", { eventName: 'boss-flow-completed', payload: null });
        this.events.emit('boss-flow-completed');
    }

    /**
     * Monitora o dano para atualizar a UI do Boss.
     */
    onBossDamaged(boss) {
        if (this.bossUI) {
            // Just update the health display, don't call show() again
            this.bossUI.update();
        }
    }
}
