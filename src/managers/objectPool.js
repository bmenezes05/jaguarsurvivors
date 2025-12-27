export class ObjectPool {
    constructor(scene, classType, initialSize = 10) {
        this.scene = scene;
        this.classType = classType;
        this.pool = [];
        this.active = [];

        for (let i = 0; i < initialSize; i++) {
            this.createNew();
        }
    }

    createNew() {
        // We create an instance but assume it's 'dead' initially
        const obj = new this.classType(this.scene);
        obj.setActive(false);
        obj.setVisible(false);
        this.pool.push(obj);
        return obj;
    }

    get(config) {
        let obj = this.pool.pop();
        if (!obj) {
            obj = this.createNew();
            // Just popped the new one, so it's not in pool anymore
            this.pool.pop();
        }

        obj.setActive(true);
        obj.setVisible(true);
        this.active.push(obj);

        if (obj.reset) {
            obj.reset(config);
        } else if (obj.spawn) { // Support alternate naming
            obj.spawn(config);
        }

        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
        }

        obj.setActive(false);
        obj.setVisible(false);
        // Optional: moves offscreen
        if (obj.setPosition) obj.setPosition(-1000, -1000);

        this.pool.push(obj);
    }

    clear() {
        this.pool.forEach(o => o.destroy());
        this.active.forEach(o => o.destroy());
        this.pool = [];
        this.active = [];
    }
}
