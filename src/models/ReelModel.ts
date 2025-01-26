import { Helper } from '../utils/Helper';

export class ReelModel {
    private symbols: string[];
    private virtualSymbols: string[];
    private stops: string[];
    private readonly reelIndex: number;
    private readonly numRows: number;

    constructor(reelIndex: number, numRows: number) {
        this.reelIndex = reelIndex;
        this.numRows = numRows;
        this.symbols = [];
        this.virtualSymbols = [];
        this.stops = [];
        // Initialize with random symbols
        this.symbols = this.getInitialSymbols();
    }

    public getVirtualReelOfLength(length: number, symbolsToExclude: string[]): string[] {
        let virtualReel: string[] = [];
        for(let i = 0; i < length; i++) {
            let symbol = Helper.getRandomSymbol();
            while(symbolsToExclude.includes(symbol)){
                symbol = Helper.getRandomSymbol();
            }
            virtualReel.push(symbol);
        }
        return virtualReel;
    }

    public getInitialSymbols(): string[] {
        // Generate initial symbols for the reel
        const symbols: string[] = [];
        for (let i = 0; i < this.numRows; i++) {
            symbols.push(Helper.getRandomSymbol());
        }
        return symbols;
    }

    public getReelIndex(): number {
        return this.reelIndex;
    }

    public getSymbols(): string[] {
        return this.symbols;
    }

    public setStops(stops: string[]): void {
        this.stops = stops;
    }

    public getStops(): string[] {
        return this.stops;
    }

    public getVirtualSymbols(): string[] {
        return this.virtualSymbols;
    }

    public updateSymbols(newSymbols: string[]): void {
        this.symbols = newSymbols;
    }
}