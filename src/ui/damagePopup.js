export class DamageTextPool {
    constructor(scene, initialSize = 30) {
        this.scene = scene;
        this.pool = [];
        this.create(initialSize);
    }

    /** Cria objetos de texto e os coloca na pool (invisíveis) */
    create(count) {
        for (let i = 0; i < count; i++) {
            const text = this.scene.add.text(0, 0, '', {
                fontSize: '18px',
                fontFamily: 'monospace',
                stroke: '#000000',
                strokeThickness: 3,
                shadow: {
                    offsetX: 1,
                    offsetY: 1,
                    color: '#000000',
                    blur: 1,
                    fill: true
                }
            }).setOrigin(0.5).setVisible(false); // Esconde inicialmente

            this.pool.push(text);
        }
    }

    /** Pega um objeto da pool, o configura e o ativa */
    get(x, y, damage) {
        let text;

        if (this.pool.length > 0) {
            text = this.pool.pop(); // Pega o último objeto
        } else {
            // Se a pool estiver vazia, cria um novo (expansão dinâmica)
            console.warn('DamageTextPool: Criando novo objeto. Considere aumentar initialSize.');
            this.create(1);
            text = this.pool.pop();
        }

        // Reseta as propriedades para o novo uso
        text.setPosition(x, y - 10); // Posiciona um pouco acima
        text.setAlpha(1);
        text.setVisible(true);
        text.setActive(true);

        return text;
    }

    /** Retorna o objeto para a pool */
    return(text) {
        text.setVisible(false);
        text.setActive(false);
        this.pool.push(text);
    }
}