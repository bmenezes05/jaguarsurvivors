/**
 * Projectile Assets Configuration
 * 
 * Defines the sprites/images used for projectiles and trails.
 * These keys are used in weapons.config.js under `projectileVisuals.spriteKey`.
 */
export const projectilesConfig = [
    {
        key: 'proj_bunch_money',
        image: 'src/assets/images/proj_money.png'
    },
    {
        key: 'proj_clt',
        image: 'src/assets/images/proj_clt.png' // Or specific projectile asset if available
    },
    {
        key: 'proj_fire_trail',
        image: 'src/assets/images/proj_poça_fogo.png' // Or specific projectile asset
    },
    {
        key: 'proj_poison_trail',
        image: 'src/assets/images/proj_poison_trail.png'
    }
];
