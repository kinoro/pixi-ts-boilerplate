import { IAsset } from "./asset.interface";
import { PixiApp } from "./pixi-app";
import { Assets } from "pixi.js"

export class Loader {
    pixiApp: PixiApp;
    assets: IAsset[] = [];

    constructor(pixiApp: PixiApp) {
        this.pixiApp = pixiApp;
    }

    async preload(): Promise<LoadResponse> {
        try {
            var loadedAssets = await Assets.load(this.pixiApp.config.assets.map(x => x.path));
            this.pixiApp.config.assets.forEach(configAsset => {
                const pathParts = configAsset.path.split('/');
                const nameParts = pathParts[pathParts.length - 1].split('.');
                this.assets.push({
                    path: configAsset.path,
                    name: nameParts[0],
                    data: loadedAssets[configAsset.path]
                })
            });
            
            return new LoadResponse(true);
        } catch (err) {
            return new LoadResponse(false, err);
        }
    }
}

export class LoadResponse {
    constructor(public isSuccess: boolean, public error: any = null) {}
}