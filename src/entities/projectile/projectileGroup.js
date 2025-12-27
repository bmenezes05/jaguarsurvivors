export function createProjectileGroup(scene, enemyGroup) {
    const group = scene.physics.add.group();

    scene.physics.add.overlap(
        group,
        enemyGroup,
        (projSprite, enemySprite) => {
            const projectile = projSprite.getData('projectile');
            const enemy = enemySprite.getData('parent');

            if (projectile?.isActive && enemy?.isActive) {
                projectile.hit(enemy);
            }
        }
    );

    return group;
}
