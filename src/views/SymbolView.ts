import { Sprite, Assets, Container } from "pixi.js";
import { SYMBOL_HEIGHT, SYMBOL_WIDTH } from "../utils/Constants";

export class SymbolView extends Container {
    private _symbolName: string = '';
    private symbolTexture!: Sprite;
    private symbolWinTexture!: Sprite;
    constructor(symbolName: string) {
        super();
        this.initialize(symbolName);
    }

    initialize(symbolName: string) {
        try {
            this._symbolName = symbolName;
            // Get the preloaded textures using their aliases
            const baseTexture = Assets.get(symbolName);
            this.symbolTexture = new Sprite(baseTexture);
            this.symbolTexture.width = SYMBOL_WIDTH;
            this.symbolTexture.height = SYMBOL_HEIGHT;
            this.addChild(this.symbolTexture);

            const winTexture = this._symbolName === 'BONUS' ? null : Assets.get(`${symbolName}_connect`);
            if(winTexture){ //Check if the win texture exists
                this.symbolWinTexture = new Sprite(winTexture);
                this.symbolWinTexture.width = SYMBOL_WIDTH;
                this.symbolWinTexture.height = SYMBOL_HEIGHT;
                this.symbolWinTexture.visible = false; // Hide win texture by default
                this.addChild(this.symbolWinTexture);
            }
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

    public playWinAnimation(): void {
        if (this.symbolWinTexture) {
            this.symbolTexture.visible = false;
            this.symbolWinTexture.visible = true;
        }else{
            this.symbolTexture.alpha = 0.5;
        }
    }

    // Getter for the sprite
    getSprite(): Sprite {
        return this.symbolTexture;
    }

    public get symbolName(): string {
        return this._symbolName;
    }
}