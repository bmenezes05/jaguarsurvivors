export class StageSystem {
    constructor(scene, mapConfig) {
        this.scene = scene;
        this.mapConfig = mapConfig;

        this.timeLeft = mapConfig?.duration || 300;
        this.totalPlayTime = 0;
        this.isSuddenDeath = false;
        this.suddenDeathTimer = 0;
        this.survivalTimer = 0;
        this.processedEvents = new Set();
    }

    update(delta) {
        if (this.scene.scene.isPaused()) return;

        if (this.scene.isEndlessMode) {
            this.survivalTimer += delta / 1000;
            this.totalPlayTime += delta / 1000;
        } else if (!this.isSuddenDeath) {
            this.timeLeft -= delta / 1000;
            this.totalPlayTime += delta / 1000;

            this.checkEvents();

            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.startSuddenDeath();
            }
        } else {
            this.updateSuddenDeath(delta);
        }
    }

    checkEvents() {
        if (!this.mapConfig?.events) return;

        this.mapConfig.events.forEach(event => {
            if (this.timeLeft <= event.time && !this.processedEvents.has(event)) {
                console.debug("EVENT_EMITTED", { eventName: 'stage-event', payload: event });
                this.scene.events.emit('stage-event', event);
                this.processedEvents.add(event);
            }
        });
    }

    startSuddenDeath() {
        this.isSuddenDeath = true;
        console.debug("EVENT_EMITTED", { eventName: 'sudden-death-start', payload: null });
        this.scene.events.emit('sudden-death-start');
    }

    updateSuddenDeath(delta) {
        this.suddenDeathTimer += delta;
        if (this.suddenDeathTimer >= this.mapConfig.suddenDeath.interval) {
            this.suddenDeathTimer = 0;
            console.debug("EVENT_EMITTED", { eventName: 'strengthen-enemies', payload: null });
            this.scene.events.emit('strengthen-enemies');
        }
    }

    onStageEvent(event) {
        // Logic for specific stage events
    }
}
