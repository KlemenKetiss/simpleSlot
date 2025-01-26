import { Container, Graphics } from 'pixi.js';
import { SymbolView } from './SymbolView';
import { MainView } from './MainView';
import gsap from 'gsap';
import { Helper } from '../utils/Helper';
interface ReelViewOptions {
    symbolHeight: number;
    symbolSpacing: number;
    numRows: number;
}

export class ReelView extends Container {
    private options: ReelViewOptions;
    private reelId: number;

    private symbols: SymbolView[] = []; //Array of old stops
    private virtualSymbols: SymbolView[] = []; //Array of virtual symbols
    private stops: SymbolView[] = []; //SETS BEFORE SPIN - Empties end of spin

    private virtualReelContainer: Container; //Holds virtuals and new stops
    private stopsReel: Container; //Holds old stops

    constructor(options: Partial<ReelViewOptions> = {}, reelId: number) {
        super();
        this.options = {
            symbolHeight: options.symbolHeight || 95,
            symbolSpacing: options.symbolSpacing || 0,
            numRows: options.numRows || 3
        };
        this.reelId = reelId;
        this.virtualReelContainer = new Container();
        this.stopsReel = new Container();
        this.initialize(this.options.numRows);

    }

    private initialize(numRows: number): void {
        // Create initial symbols for the reel
        for (let i = 0; i < numRows; i++) {
            // Create a default symbol (can be updated later)
            const symbolView = new SymbolView(Helper.getRandomSymbol());
            
            // Position symbol vertically with spacing
            symbolView.y = i * (this.options.symbolHeight + this.options.symbolSpacing);
            
            // Center the symbol horizontally within the reel
            symbolView.x = 0;
            
            // Add to our tracking array and to the container
            this.symbols.push(symbolView);
            this.stopsReel.addChild(symbolView)
        }
        this.addChild(this.stopsReel)

    }

    public updateSymbol(index: number, symbolName: string): void {
        if (index >= 0 && index < this.symbols.length) {
            this.symbols[index].changeSymbol(symbolName);
        }
    }

    public spin(): void {
        this.setVirtualReel(20); //Set virtual reel to spin
        this.spinReels(); //Spin to final position
    }

    private setVirtualReel(virtualReelLength: number): void {
        // Create container for virtual reel symbols
        this.addChild(this.virtualReelContainer);
        const virtualReel = this.getVirtualReelOfLength(virtualReelLength, ["BONUS"]);
        // Create new symbol views for virtual reel positions
        const stopSyms = MainView.getInstance.reelsView.getStops()[this.reelId];
        for(let i = 0; i < stopSyms.length; i++){
            const symbolView = new SymbolView(stopSyms[i]);
            // Position above visible symbols, above where virtual reel symbols will be
            symbolView.y = -this.options.symbolHeight * (virtualReel.length + stopSyms.length - i);
            // Center horizontally like other symbols
            symbolView.x = 0;
            
            this.stops.push(symbolView);
            this.virtualReelContainer.addChild(symbolView);
        }

        virtualReel.forEach((symbolName, index) => {
            const symbolView = new SymbolView(symbolName);
            // Position above visible symbols but below stopSyms
            symbolView.y = -this.options.symbolHeight * (virtualReel.length - index);
            // Center horizontally like other symbols
            symbolView.x = 0;
            
            this.virtualSymbols.push(symbolView);
            this.virtualReelContainer.addChild(symbolView);
        });
        
    }

    private spinReels(){
        gsap.to(this.virtualReelContainer, {
            delay: this.reelId * 0.1, // Add 0.2s delay per reel
            y: this.options.symbolHeight * (this.virtualSymbols.length + this.options.numRows),
            duration: 1,
            ease: "power1.inOut",
        });
        gsap.to(this.stopsReel, {
            delay: this.reelId * 0.1, // Add 0.2s delay per reel
            y: this.options.symbolHeight * (this.virtualSymbols.length + this.options.numRows),
            duration: 1,
            ease: "power1.inOut",
            onComplete: () => {
                gsap.delayedCall(0.5, () => {
                    this.clearSymbolsReel();
                });
            }
        });
    }

    private clearVirtualReel(){
        this.virtualSymbols.forEach(symbol => {
            symbol.dispose(true);
        });
        this.virtualSymbols = [];
        this.virtualReelContainer.y = 0;
        this.virtualReelContainer.removeChildren();
        this.removeChild(this.virtualReelContainer);
        this.virtualSymbols.forEach(symbol => {
            symbol.dispose();
        });
        if(this.reelId+1 == MainView.getInstance.reelsView.getNumberOfReels()){
            MainView.getInstance.panelView.emit("spinConcluded");
        }
    }

    private clearSymbolsReel(): void {
        // Remove symbols from stopsReel but don't dispose them yet
        this.stopsReel.removeChildren();
        this.symbols = [];
        // Move the final symbols from virtual reel to stops reel
        for (let i = 0; i < this.options.numRows; i++) {
            const symbol = this.stops[i];
            this.virtualReelContainer.removeChild(symbol);
            this.stopsReel.addChild(symbol);
            symbol.y = i * this.options.symbolHeight;
            this.symbols.push(symbol);
        }
        this.stops = [];
        this.stopsReel.y = 0;
        // Clear virtual reel container but don't dispose symbols that were moved
        this.clearVirtualReel();
    }

    public getVirtualReelOfLength(length: number, symbolsToExclude: string[]): string[]{
        let virtualReel: string[] = [];
        for(let i = 0; i < length; i++){
            let symbol = Helper.getRandomSymbol();
            while(symbolsToExclude.includes(symbol)){
                symbol = Helper.getRandomSymbol();
            }
            virtualReel.push(symbol);
        }
        return virtualReel;
    }

    public getReelId(): number {
        return this.reelId;
    }

    public getSymboInRow(row: number): SymbolView | null {
        if (row >= 0 && row < this.symbols.length) {
            return this.symbols[row];
        }
        return null;
    }

    public dispose(): void {
        // Clean up all symbols
        this.symbols.forEach(symbol => {
            symbol.dispose();
        });
        this.symbols = [];
        this.removeChildren();
    }
}
