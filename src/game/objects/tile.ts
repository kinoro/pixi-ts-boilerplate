import { Sprite } from "pixi.js";
import { PixiApp } from "../../system/pixi-app";
import { Field } from "./field";
import { gsap } from 'gsap';

export class Tile {
    color: string;
    sprite?: Sprite | null;
    field?: Field | null;

    constructor(color: string) {
        this.color = color;
        this.sprite = PixiApp.Instance.sprite(this.color);
        this.sprite.anchor.set(0.5);
    }

    setPosition(position: {x: number, y: number}) {
        this.sprite!.x = position.x;
        this.sprite!.y = position.y;
    }

    moveTo(position: {x: number, y: number}, duration: number): Promise<void> {
        return new Promise(resolve => {
            gsap.to(this.sprite!, {
                duration,
                pixi: {
                    x: position.x,
                    y: position.y
                },
                onComplete: () => {
                    resolve()
                }
            });
        });
    }

    isNeighbour(tile: Tile) {
        return Math.abs(this.field!.row - tile.field!.row) + Math.abs(this.field!.col - tile.field!.col) === 1
    }

    remove() {
        if (!this.sprite) {
            return;
        }
        this.sprite.destroy();
        this.sprite = null;

        if (this.field) {
            this.field.tile = null;
            this.field = null;
        }
    }

    fallDownTo(position: {x: number, y: number}, delay: number) {
        return this.moveTo(position, delay);
    }
}