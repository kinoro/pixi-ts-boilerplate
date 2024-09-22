import { Container } from "pixi.js";
import { Scene } from "./scene";
import { PixiApp } from "./pixi-app";

export class SceneManager {
    pixiApp: PixiApp;
    container: Container;
    scene?: Scene;

    constructor(pixiApp: PixiApp) {
        this.pixiApp = pixiApp;
        this.container = new Container();
        this.container.interactive = true;
    }

    start(sceneName: string) {
        if (this.scene) {
            this.scene.remove();
        }

        this.scene = new this.pixiApp.config.scenes[sceneName](this.pixiApp);
        this.container.addChild(this.scene.container);
    }
}