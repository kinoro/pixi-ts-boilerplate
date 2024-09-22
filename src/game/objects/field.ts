import { Sprite } from "pixi.js";
import { PixiApp } from "../../system/pixi-app";
import { Tile } from "./tile";

export class Field {

    sprite: Sprite;
    selected: Sprite;
    tile?: Tile | null;

    get position() {
        return {
            x: this.col * this.sprite.width,
            y: this.row * this.sprite.height
        };
    }
    
    constructor(public row: number, public col: number) {
        this.row = row;
        this.col = col;

        this.sprite = PixiApp.Instance.sprite("field");
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.anchor.set(0.5);

        this.selected = PixiApp.Instance.sprite("field-selected");
        this.sprite.addChild(this.selected);
        this.selected.visible = false;
        this.selected.anchor.set(0.5);
    }

    setTile(tile: Tile) {
        this.tile = tile;
        tile.field = this;
        tile.setPosition(this.position);
    }

    unselect() {
        this.selected.visible = false;
    }

    select() {
        this.selected.visible = true;
    }
}