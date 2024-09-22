import { Container } from "pixi.js";
import { Field } from "./field";
import { PixiApp } from "../../system/pixi-app";
import { Config } from "../config";
import { TileFactory } from "../logic/tile-factory";
import { Tile } from "./tile";

export class Board {

    container: Container;
    fields: Field[];
    rows: number;
    cols: number;
    fieldSize: number = 0;
    width: number = 0;
    height: number = 0;

    constructor() {
        this.container = new Container();
        this.fields = [];
        this.rows = PixiApp.Config<Config>().board.rows;
        this.cols = PixiApp.Config<Config>().board.cols;
        this.create();
        this.adjustPosition();
    }

    create() {
        this.createFields();
        this.createTiles();
    }

    createFields() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
    }
    createField(row: number, col: number) {
        const field = new Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
    }

    createTiles() {
        this.fields.forEach(field => this.createTile(field));
    }

    createTile(field: Field) {
        const tile = TileFactory.generate();
        tile.sprite!.interactive = true;
        tile.sprite!.on("pointerdown", () => {
            this.container.emit('tile-touch-start', tile);
        });
        field.setTile(tile);
        this.container.addChild(tile.sprite!);

        return tile;
    }

    adjustPosition() {
        this.fieldSize = this.fields[0].sprite.width;
        this.width = this.cols * this.fieldSize;
        this.height = this.rows * this.fieldSize;
        this.container.x = (PixiApp.Instance.app.canvas.width - this.width) / 2 + this.fieldSize / 2;
        this.container.y = (PixiApp.Instance.app.canvas.height - this.height) / 2 + this.fieldSize / 2;
    }

    swap(tile1: Tile, tile2: Tile) {
        const tile1Field = tile1.field!;
        const tile2Field = tile2.field!;

        tile1Field.tile = tile2;
        tile2.field = tile1Field;

        tile2Field.tile = tile1;
        tile1.field = tile2Field;
    }

    getField(row: number, col: number) {
        return this.fields.find(field => field.row === row && field.col === col);
    }
}