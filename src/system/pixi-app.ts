import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./loader";
import { SceneManager } from "./scene-manager";
import { Application, Assets, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";
import { IConfig } from "./config.interface";

export class PixiApp {
    static Instance: PixiApp;
    static Config<T>() { return this.Instance.config as T; }

    app: Application;
    config: IConfig;
    sceneManager: SceneManager;
    loader: Loader;

    constructor(config: IConfig) {
        PixiApp.Instance = this;

        this.config = config;

        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.app = new Application();
        this.sceneManager = new SceneManager(this);
        this.loader = new Loader(this);

        this.init();
    }

    async init() {
        await this.app.init({resizeTo: window});
        this.app.canvas.style.position = "absolute";

        document.body.appendChild(this.app.canvas);

        this.app.stage.interactive = true; // ensure UI events are fired
        this.app.stage.addChild(this.sceneManager.container);

        this.loader.preload().then(loadResult => {
            if (loadResult.isSuccess) {
                this.startScene("Game");
            } else {
                console.error(loadResult.error);
            }
        });
    }

    asset(assetName: string) {
        const asset = this.loader.assets.find(x => x.name == assetName);
        if (asset == null) { throw `Asset with name '${assetName}' not found!`; }

        return asset.data;
    }

    sprite(assetName: string) { return new Sprite(this.asset(assetName)); }

    startScene(sceneName: string) { this.sceneManager.start(sceneName); }
}