import { Container } from "pixi.js";
import { Sprite } from "pixi.js";
import { Assets } from "pixi.js";
import { SYMBOL_HEIGHT, SYMBOL_WIDTH } from "../utils/Constants";

export class SymbolView extends Container {
    private _symbolName: string = '';
    private symbolTexture: Sprite = new Sprite();
    private symbolWinTexture: Sprite = new Sprite();
    constructor(symbolName: string) {
        super();
        this.initialize(symbolName);
    }

    initialize(symbolName: string) {
        try {
            this._symbolName = symbolName;
            
            // Get the preloaded textures using their aliases
            const baseTexture = Assets.get(symbolName);
            const winTexture = Assets.get(`${symbolName}_connect`);
            
            this.symbolTexture = new Sprite(baseTexture);
            this.symbolWinTexture = new Sprite(winTexture);
            
            // Set dimensions
            this.symbolTexture.width = SYMBOL_WIDTH;
            this.symbolTexture.height = SYMBOL_HEIGHT;
            this.symbolWinTexture.width = SYMBOL_WIDTH;
            this.symbolWinTexture.height = SYMBOL_HEIGHT;
            this.addChild(this.symbolTexture);
            this.symbolWinTexture.visible = false; // Hide win texture by default
            this.addChild(this.symbolWinTexture);
            
        } catch (error) {
            console.error('Error initializing symbol:', error);
        }
    }

    public dispose(disposeOfItself = false): void {
        this.removeChildren();
        // Destroy the current sprite and its texture
        if (this.symbolTexture) {
            this.symbolTexture.destroy();
        }
        if(this.symbolWinTexture) {
            this.symbolWinTexture.destroy();
        }

        if(disposeOfItself){
            this.destroy({children: true})
        }
    }

    public changeSymbol(newSymbolName: string): void {
        this.dispose();
        this.initialize(newSymbolName);
    }

    // Optional: Add method to show/hide win state
    public setWinState(isWin: boolean): void {
        if (this.symbolTexture && this.symbolWinTexture) {
            this.symbolTexture.visible = !isWin;
            this.symbolWinTexture.visible = isWin;
        }
    }

    public playWinAnimation(): void {
        this.symbolTexture.visible = false;
        this.symbolWinTexture.visible = true;
    }

    // Getter for the sprite
    getSprite(): Sprite {
        return this.symbolTexture;
    }

    public get symbolName(): string {
        return this._symbolName;
    }
}