import { IAsset } from "../system/asset.interface";
import { IConfig } from "../system/config.interface";
import { GameScene } from "./scenes/game.scene";

export class Config implements IConfig
{
    assets: IAsset[] = [
        { path: 'assets/sprites/bg.png' },
        { path: 'assets/sprites/blue.png' },
        { path: 'assets/sprites/field-selected.png' },
        { path: 'assets/sprites/field.png' },
        { path: 'assets/sprites/green.png' },
        { path: 'assets/sprites/orange.png' },
        { path: 'assets/sprites/pink.png' },
        { path: 'assets/sprites/red.png' },
        { path: 'assets/sprites/yellow.png' },
    ];

    scenes = {
        "Game": GameScene
    };

    board = {
        rows: 7,
        cols: 7
    }

    tileColors: string[] = ['blue', 'green', 'orange', 'red', 'pink', 'yellow'];

    combinationRules = [
        [
            {col: 1, row: 0}, 
            {col: 2, row: 0},
        ], 
        [
            {col: 0, row: 1}, 
            {col: 0, row: 2},
        ]
    ]
}