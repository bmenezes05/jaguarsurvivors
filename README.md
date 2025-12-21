# 🐆 Jaguar Survivors (BETA)

![Phaser 3](https://img.shields.io/badge/Engine-Phaser%203-blue?style=for-the-badge&logo=phaser)
![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES6-yellow?style=for-the-badge&logo=javascript)
![Status](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge)

> **O relógio corre, a horda ruge. O quanto você consegue aguentar?**

**Jaguar Survivors** é um RPG de ação *roguelite* no estilo "Bullet Heaven" (inspirado em clássicos como Vampire Survivors). Enfrente centenas de inimigos simultâneos, colete gemas de experiência, evolua seu arsenal e derrote chefes colossais antes que o tempo se esgote.

---

## 🎮 O Jogo

Em um mundo onde a sobrevivência é a única regra, você controla heróis únicos em uma missão contra o tempo. Cada partida dura 10 minutos (configurável), culminando em uma batalha épica contra chefes. Se o tempo zerar... prepare-se para o modo **Sudden Death**.

### ⚔️ Mecânicas Principais
- **Progressão Dinâmica:** Escolha upgrades a cada nível para criar builds únicas.
- **Sistema de Status (Debuffs):** Aplique **Queimadura**, **Congelamento (Slow)**, **Choque** e **Veneno** nos inimigos.
- **Loot de Boss:** Derrote chefes para ganhar itens lendários como **Magnetos de XP**, **Bombas de Mapa** e **Kits de Cura**.
- **Sustentabilidade:** Melhore seus atributos de **Life Steal (Roubo de Vida)** e **Regeneração de HP** para sobreviver às ondas finais.



---

## 🚀 Diferenciais Técnicos

Este projeto não é apenas um jogo, mas um estudo de performance em ambientes de alta densidade de objetos usando **Phaser 3**.

### 🏗️ Arquitetura
- **Object Pooling System:** Sistema customizado de reciclagem de memória para Projéteis e Inimigos. Isso permite centenas de entidades na tela sem quedas de FPS, evitando o *Garbage Collection* pesado.
- **Data-Driven Design:** Todo o balanceamento de armas, inimigos e waves é controlado via `config.js`, permitindo ajustes rápidos sem mexer na lógica central.
- **Event-Driven UI:** A interface do usuário é atualizada via eventos, garantindo que a lógica do jogo e a visualização estejam desacopladas.

### ⏱️ Sistema de Fases
- O cronômetro agora é regressivo, criando uma curva de tensão mais clara.
- Eventos disparados por tempo (Timers) controlam quando os Bosses surgem e quando o ambiente muda visualmente.



---

## 🛠️ Como Executar

Como o projeto utiliza módulos ES6, ele precisa ser servido via protocolo HTTP.

## 🎨 Créditos e Tecnologias
-- **Engine:** Phaser 3
-- **Lógica:** JavaScript Puro (ES6+)
-- **Design de Sistemas:** Inspirado na estrutura de jogos Survivors-like.

Desenvolvido por [Bruno Menz]. Se você gostou do projeto ou quer acompanhar a evolução, deixe uma ⭐ no repositório!
