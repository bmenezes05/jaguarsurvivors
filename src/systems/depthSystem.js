export class DepthSystem {
    static sortPlayer(player) {
        player.container.depth = player.y + (player.bodyHeight / 2);
    }

    static sortEnemies(enemies) {
        enemies.forEach(enemy => {
            if (enemy.isActive) {
                enemy.container.depth = enemy.container.y + (enemy.bodyHeight / 2);
            }
        });
    }

    static sortPickups(pickups) {
        pickups.getChildren().forEach(p => p.depth = p.y);
    }

    static sortGems(gems) {
        gems.forEach(g => {
            if (g.isActive && g.sprite) {
                g.sprite.depth = g.sprite.y;
            }
        });
    }
}
