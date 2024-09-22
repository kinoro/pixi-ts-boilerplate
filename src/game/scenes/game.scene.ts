import { Sprite } from "pixi.js";
import { Scene } from "../../system/scene";
import { Field } from "../objects/field";
import { Board } from "../objects/board";
import { Tile } from "../objects/tile";
import { CombinationManager } from "../logic/combination-manager";

export class GameScene extends Scene {
    bg?: Sprite;
    board?: Board;
    selectedTile?: Tile | null;
    disabled: boolean = false;
    combinationManager?: CombinationManager;

    override create() {
        this.createBackground();
        this.combinationManager = new CombinationManager(this.board!);
        this.removeStartMatches();
    }

    createBackground() {
        this.bg = this.pixiApp.sprite("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);

        this.board = new Board();
        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));
        this.container.addChild(this.board.container);
    }

    selectTile(tile: Tile) {
        this.selectedTile = tile;
        this.selectedTile.field!.select();
    }

    swap(selectedTile: Tile, tile: Tile, reverse: boolean) {
        this.disabled = true;        // lock the board to prevent tiles from moving again while the animation is already running
        this.clearSelection();      // hide the "field-selected" frame from the field of the selectedTile object
        selectedTile.sprite!.zIndex = 2; // place the selectedTile sprite one layer higher than the tile sprite

        selectedTile.moveTo(tile.field!.position, 0.2); // move selectedTile to tile position
        // move tile to electedTile position
        tile.moveTo(selectedTile.field!.position, 0.2).then(() => {
            // after motion animations complete:
            // change the values of the field properties in the tile objects
            // change the values of the tile properties in the field objects
            this.board!.swap(selectedTile, tile);

            if (!reverse) {
                // if this is the main swap, then we are looking for combinations
                const matches = this.combinationManager!.getMatches();
                if (matches.length) {
                    // if there are combinations, then process them
                    this.processMatches(matches);
                } else {
                    // if there are no combinations after the main swap, then perform a reverse swap by running the same method, but with the reverse parameter
                    this.swap(tile, selectedTile, true);
                }
            } else {
                this.disabled = false; // unlock the board
            }
            
        });
    }

    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field!.unselect();
            this.selectedTile = null;
        }
    }

    onTileClick(tile: Tile) {
        if (this.disabled) {
            return;
        }

        if (this.selectedTile) {
            if (!this.selectedTile.isNeighbour(tile)) {
                this.clearSelection();
                this.selectTile(tile);
            } else {
                this.swap(this.selectedTile, tile, false);
            }
        } else {
            this.selectTile(tile);
        }
    }

    processMatches(matches: Tile[][]) {
        this.removeMatches(matches);
        this.processFallDown().then(() => this.addTiles()).then(() => this.onFallDownOver());
    }

    removeMatches(matches: Tile[][]) {
        matches.forEach(match => {
            match.forEach(tile => {
                tile.remove();
            });
        });
    }

    processFallDown(): Promise<void> {
        return new Promise(resolve => {
            let completed = 0;
            let started = 0;

            // check all fields of the board, starting from the bottom row
            for (let row = this.board!.rows - 1; row >= 0; row--) {
                for (let col = this.board!.cols - 1; col >= 0; col--) {
                    const field = this.board!.getField(row, col);

                    // if there is no tile in the field
                    if (!field?.tile) {
                        ++started;

                        // shift all tiles that are in the same column in all rows above
                        this.fallDownTo(field!).then(() => {
                            ++completed;
                            if (completed >= started) {
                                resolve();
                            }
                        });
                    }
                }
            }
        });
    }

    fallDownTo(emptyField: Field): Promise<void> {
        // checking all board fields in the found empty field column, but in all higher rows
        for (let row = emptyField.row - 1; row >= 0; row--) {
            let fallingField = this.board!.getField(row, emptyField.col);

            // find the first field with a tile
            if (fallingField?.tile) {
                // the first found tile will be placed in the current empty field
                const fallingTile = fallingField.tile;
                fallingTile.field = emptyField;
                emptyField.tile = fallingTile;
                fallingField.tile = null;
                // run the tile move method and stop searching a tile for that empty field
                return fallingTile.fallDownTo(emptyField.position, 0.5);
            }
        }

        return Promise.resolve();
    }

    addTiles(): Promise<void> {
        return new Promise(resolve => {
            // get all fields that don't have tiles
            const fields = this.board!.fields.filter(field => field.tile === null);
            let total = fields.length;
            let completed = 0;

            // for each empty field
            fields.forEach(field => {
                // create a new tile
                const tile = this.board!.createTile(field);
                // put it above the board
                tile.sprite!.y = -500;
                const delay = Math.random() * 2 / 10 + 0.3 / (field.row + 1);
                // start the movement of the tile in the given empty field with the given delay
                tile.fallDownTo(field.position, delay).then(() => {
                    ++completed;
                    if (completed >= total) {
                        resolve();
                    }
                });
            });
        });
    }

    onFallDownOver() {
        const matches = this.combinationManager!.getMatches();

        if (matches.length) {
            this.processMatches(matches)
        } else {
            this.disabled = false;
        }
    }

    removeStartMatches() {
        let matches = this.combinationManager!.getMatches(); // find combinations to collect

        while(matches.length) { // as long as there are combinations
            this.removeMatches(matches); // remove tiles in combinations

            const fields = this.board!.fields.filter(field => field.tile === null); // find empty fields

            fields.forEach(field => { // in each empty field
                this.board!.createTile(field); // create a new random tile
            });

            matches = this.combinationManager!.getMatches(); // looking for combinations again after adding new tiles
        }
    }
}