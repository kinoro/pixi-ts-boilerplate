import { Container } from "pixi.js";
import { PixiApp } from "./pixi-app";

export class Scene {
    pixiApp: PixiApp;
    container: Container;

    constructor(pixiApp: PixiApp) {
        this.pixiApp = pixiApp;

        this.container = new Container();
        this.container.interactive = true;
        this.create();
        this.pixiApp.app.ticker.add(this.update, this);
    }

    create() {}
    update() {}
    destroy() {}

    remove() {
        this.pixiApp.app.ticker.remove(this.update, this);
        this.destroy();
    }
}