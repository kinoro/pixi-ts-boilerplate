import { PixiApp } from "../../system/pixi-app";
import { Config } from "../config";
import { Board } from "../objects/board";
import { Tile } from "../objects/tile";

export class CombinationManager {
    constructor(private board: Board) {
    }

    getMatches() {
        let result: Tile[][] = [];

        this.board.fields.forEach(checkingField => {
            PixiApp.Config<Config>().combinationRules.forEach(rule => {
                let matches: Tile[] = [checkingField.tile!];

                rule.forEach(position => {
                    const row = checkingField.row + position.row;
                    const col = checkingField.col + position.col;
                    const comparingField = this.board.getField(row, col);
                    if (comparingField && comparingField.tile!.color === checkingField.tile!.color) {
                        matches.push(comparingField.tile!);
                    }
                });

                if (matches.length === rule.length + 1) {
                    result.push(matches);
                }
            });
        });

        return result;
    }
}