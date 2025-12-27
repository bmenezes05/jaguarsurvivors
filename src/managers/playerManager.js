export class PlayerManager {
    constructor(scene) {
        this.scene = scene;
        this.player = null;
    }

    /* ------------------------------------------------------------------ */
    /* ------------------------------ INIT -------------------------------- */
    /* ------------------------------------------------------------------ */

    create() {
        this.player = this.scene.player;

        if (!this.player) {
            throw new Error('[PlayerManager] Player não foi criado no SceneBootstrap');
        }

        this.registerCamera();
    }

    /* ------------------------------------------------------------------ */
    /* ----------------------------- CAMERA ------------------------------ */
    /* ------------------------------------------------------------------ */

    registerCamera() {
        const cam = this.scene.cameras.main;

        if (this.player && this.player.view && this.player.view.container) {
            cam.startFollow(this.player.view.container, true, 0.08, 0.08);
        }
        cam.setZoom(1);
    }

    onPlayerDied() {
        console.debug("EVENT_EMITTED", { eventName: 'player-dead', payload: null });
        this.scene.events.emit('player-dead');
    }

    /* ------------------------------------------------------------------ */
    /* ----------------------------- UPDATE ------------------------------ */
    /* ------------------------------------------------------------------ */

    update(time, delta) {
        if (!this.player || !this.player.view || !this.player.view.container.active) return;

        this.player.update(delta);
        this.syncDepth();
    }

    syncDepth() {
        if (this.player && this.player.view && this.player.view.container) {
            this.player.view.container.setDepth(this.player.y);
        }
    }
}
