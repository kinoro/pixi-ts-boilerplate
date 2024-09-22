import { PixiApp } from "../../system/pixi-app";
import { Tools } from "../../system/tools";
import { Config } from "../config";
import { Tile } from "../objects/tile";

export class TileFactory {
    static generate() {
        const color = PixiApp.Config<Config>().tileColors[Tools.randomNumber(0, PixiApp.Config<Config>().tileColors.length - 1)];
        return new Tile(color);
    }
}