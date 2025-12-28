import { CONFIG } from '../config/config.js';
import { Enemy } from '../entities/enemy/enemy.js';
import { ObjectPool } from '../managers/objectPool.js';

/**
 * EnemySpawner
 * Responsabilidade: Gerenciar a criação e reciclagem física de inimigos.
 * NÃO deve decidir fluxos de jogo ou lógica de chefes.
 */
export class EnemySpawner {
    constructor(scene, player, mapConfig) {
        this.scene = scene;
        this.player = player;
        this.mapConfig = mapConfig;

        this.enemies = []; // Lista de instâncias ativas
        this.group = scene.physics.add.group();

        // Configuração de ondas
        this.waves = mapConfig.waves;
        this.wave = 0;
        this.waveConfig = this.waves[this.wave];
        this.timer = 0;

        // Controle de ciclo de vida da onda
        this.spawnedCount = 0;
        this.isWaveFinished = false;

        // Pool de objetos para performance
        this.enemyPool = new ObjectPool(scene, Enemy, 100);
    }

    /**
     * Inicializa/Reseta o estado para uma nova onda.
     */
    initWave(waveIndex) {
        if (!this.waves[waveIndex]) {
            console.warn(`Wave ${waveIndex} not found in config.`);
            return;
        }

        this.wave = waveIndex;
        this.waveConfig = this.waves[waveIndex];
        this.spawnedCount = 0;
        this.timer = 0;
        this.isWaveFinished = false;

        // Notifica o sistema sobre a mudança de onda
        const payload = {
            index: this.wave + 1,
            config: this.waveConfig,
            isBossWave: this.waveConfig.bossPerWave > 0
        };
        console.debug("EVENT_EMITTED", { eventName: 'wave-changed', payload });
        this.scene.events.emit('wave-changed', payload);
    }

    /**
     * Atualiza o loop de spawn e a reciclagem.
     * @param {number} delta 
     */
    update(delta) {
        this.handleCleanup();
        this.handleWaves(delta);
        this.updateEnemies(delta);
        this.checkWaveCompletion();
    }

    /**
     * Remove inimigos inativos e devolve para a pool.
     */
    handleCleanup() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy.isActive) {
                if (this.group.contains(enemy.container)) {
                    this.group.remove(enemy.container);
                }
                this.enemyPool.release(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }

    /**
     * Chama o update de cada inimigo ativo.
     */
    updateEnemies(delta) {
        this.enemies.forEach(enemy => {
            if (enemy.isActive) {
                enemy.update(this.player, delta);
            }
        });
    }

    /**
     * Gerencia o timer de spawn baseado na onda atual.
     */
    handleWaves(delta) {
        if (!this.waveConfig || this.isWaveFinished) return;

        // Verifica se ainda há cota para spawnar
        if (this.spawnedCount >= this.waveConfig.totalEnemies) {
            return;
        }

        let timerIncrement = delta;

        // Modificador de ritmo se houver boss
        const bossActive = this.enemies.some(e => e.isBoss);
        if (bossActive) {
            timerIncrement *= 0.5;
        }

        this.timer += timerIncrement;
        if (this.timer >= this.waveConfig.interval) {
            this.timer = 0;
            this.spawnWave();
        }
    }

    /**
     * Verifica se a onda atual foi completada.
     */
    checkWaveCompletion() {
        if (this.isWaveFinished) return;

        // Condição: Cota atingida E todos os inimigos derrotados
        const quotaReached = this.spawnedCount >= this.waveConfig.totalEnemies;
        const allCleared = this.enemies.length === 0;

        if (quotaReached && allCleared) {
            this.isWaveFinished = true;
            this.nextWave();
        }
    }

    /**
     * Avança para a próxima onda.
     */
    nextWave() {
        const nextIndex = this.wave + 1;
        if (this.waves[nextIndex]) {
            this.initWave(nextIndex);
        } else {
            // Opcional: Loop infinito ou emitir evento de vitória
        }
    }

    /**
     * Spawna um conjunto de inimigos conforme config da onda.
     */
    spawnWave() {
        if (this.enemies.length >= this.waveConfig.maxOnScreen) return;

        const count = this.waveConfig.enemiesPerWave || 1;
        const enemyTypes = this.waveConfig.enemyTypes || [];

        if (enemyTypes.length === 0) return;

        for (let i = 0; i < count; i++) {
            // Verifica cota individualmente para cada spawn no loop
            if (this.spawnedCount >= this.waveConfig.totalEnemies) break;

            // Seleciona tipo aleatório da lista (pode ser expandido para pesos)
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const enemyConfig = CONFIG.enemy.find(e => e.key === type);

            if (enemyConfig) {
                this.spawnEntity(enemyConfig);
                this.spawnedCount++;
            }
        }
    }

    /**
     * Spawna uma entidade específica.
     */
    spawnEntity(config, options = {}) {
        const ang = options.angle || Math.random() * Math.PI * 2;
        const dist = options.distance || this.waveConfig.spawnDistance || 700;

        const x = options.x || this.player.x + Math.cos(ang) * dist;
        const y = options.y || this.player.y + Math.sin(ang) * dist;

        const enemy = this.enemyPool.get({ x, y, enemyConfig: config });

        this.enemies.push(enemy);
        if (!this.group.contains(enemy.container)) {
            this.group.add(enemy.container);
            enemy.container.enemy = enemy;
        }

        return enemy;
    }

    /**
     * Reseta o spawner para o estado inicial.
     */
    reset() {
        this.enemies.forEach(e => {
            if (this.group.contains(e.container)) {
                this.group.remove(e.container);
            }
            this.enemyPool.release(e);
        });
        this.enemies = [];
        this.initWave(0);
    }

    getGroup() { return this.group; }
    getEnemies() { return this.enemies; }
}
