import { IAsset } from "./asset.interface";
import { Scene } from "./scene";

export interface IConfig {
    assets: IAsset[];
    scenes: { [key: string] : typeof Scene; };
    combinationRules: {col: number; row: number}[][];
}