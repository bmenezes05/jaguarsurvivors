import { CONFIG } from '../config/config.js';

export class WorldManager {
    constructor(scene, mapConfig) {
        this.scene = scene;
        this.mapConfig = mapConfig;

        this.createBackground();
        this.configureBounds();
        this.drawWorldBorder();
    }

    /* ------------------------------------------------------------------ */
    /* --------------------------- BACKGROUND ---------------------------- */
    /* ------------------------------------------------------------------ */

    createBackground() {
        const worldW = CONFIG.world.width;
        const worldH = CONFIG.world.height;
        const margin = 1000;

        this.bgOutside = this.scene.add.tileSprite(
            worldW / 2,
            worldH / 2,
            worldW + margin * 2,
            worldH + margin * 2,
            `bg_${this.mapConfig.id}_outside`
        ).setDepth(-2);

        this.bgInner = this.scene.add.tileSprite(
            worldW / 2,
            worldH / 2,
            worldW,
            worldH,
            `bg_${this.mapConfig.id}_inner`
        ).setDepth(-1);
    }

    /* ------------------------------------------------------------------ */
    /* -------------------------- PHYSICS / CAMERA ----------------------- */
    /* ------------------------------------------------------------------ */

    configureBounds() {
        const worldW = CONFIG.world.width;
        const worldH = CONFIG.world.height;
        const margin = 1000;

        this.scene.physics.world.setBounds(0, 0, worldW, worldH);

        this.scene.cameras.main.setBounds(
            -margin / 2,
            -margin / 2,
            worldW + margin,
            worldH + margin
        );
    }

    /* ------------------------------------------------------------------ */
    /* ---------------------------- VISUAL BORDER ------------------------ */
    /* ------------------------------------------------------------------ */

    drawWorldBorder() {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(8, 0x000000, 0.5);
        graphics.strokeRect(
            0,
            0,
            CONFIG.world.width,
            CONFIG.world.height
        );
        graphics.setDepth(0);
    }

    /**
     * Clamps a position strictly inside the playable world bounds.
     * @param {number} x 
     * @param {number} y 
     * @param {number} margin - Padding from the edge
     * @returns {Object} {x, y}
     */
    clampPosition(x, y, margin = 50) {
        const worldW = CONFIG.world?.width || 1500;
        const worldH = CONFIG.world?.height || 1500;

        return {
            x: Phaser.Math.Clamp(x, margin, worldW - margin),
            y: Phaser.Math.Clamp(y, margin, worldH - margin)
        };
    }
}
