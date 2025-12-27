export class PickupSystem {
    constructor(scene) {
        this.scene = scene;

        this.player = scene.player;
        this.playerBody = scene.player.view.container;
        this.pickupManager = scene.pickupManager;

        if (!this.player || !this.pickupManager) {
            throw new Error('[PickupSystem] Dependências não inicializadas');
        }

        this.registerOverlap();
    }

    /* ------------------------------------------------------------------ */
    /* ----------------------------- SETUP ------------------------------- */
    /* ------------------------------------------------------------------ */

    registerOverlap() {
        if (!this.pickupManager?.group) return;

        this.scene.physics.add.overlap(
            this.playerBody,
            this.pickupManager.group,
            this.onPickupCollected,
            null,
            this
        );
    }
    /* ------------------------------------------------------------------ */
    /* ----------------------------- UPDATE ------------------------------ */
    /* ------------------------------------------------------------------ */

    update(time, delta) {
        this.updateMagnet(delta);
        this.pickupManager.update();
    }

    updateMagnet(delta) {
        if (!this.pickupManager?.group) return;

        const magnetRadius = this.player.stats.pickupRadius || 100;
        const playerX = this.player.x;
        const playerY = this.player.y;

        this.pickupManager.group.children.iterate(pickup => {
            if (!pickup || !pickup.active) return;

            const dist = Phaser.Math.Distance.Between(
                pickup.x,
                pickup.y,
                playerX,
                playerY
            );

            if (dist <= magnetRadius) {
                this.scene.physics.moveToObject(
                    pickup,
                    this.player.view.container,
                    600
                );
            }
        });
    }


    /* ------------------------------------------------------------------ */
    /* ---------------------------- COLLECTION --------------------------- */
    /* ------------------------------------------------------------------ */

    onPickupCollected(player, pickup) {
        if (!pickup.active) return;

        pickup.collect(player);

        console.debug("EVENT_EMITTED", { eventName: 'pickup-collected', payload: pickup.type });
        this.scene.events.emit('pickup-collected', pickup.type);
    }
}
