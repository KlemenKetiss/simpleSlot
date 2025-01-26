import { Container, Graphics } from 'pixi.js';
import { ReelView } from './ReelView';
import { Helper } from '../utils/Helper';
import { gsap } from 'gsap';
import { MainView } from './MainView';
import { ReelModel } from '../models/ReelModel';
interface ReelsViewOptions {
    numReels: number;
    numRows: number;
    reelWidth: number;
    symbolHeight: number;
    reelSpacing: number;
    yOffset: number;
    screenWidth: number;
}

export class ReelsView extends Container {
    private reelViews: ReelView[] = [];
    private reelModels: ReelModel[] = []; // Add reelModels array
    private options: ReelsViewOptions;
    public mask!: Graphics;
    public stops!: Array<Array<string>>;
    constructor(options: Partial<ReelsViewOptions> = {}) {
        super();
        this.options = {
            numReels: options.numReels || 5,
            numRows: options.numRows || 3,
            reelWidth: options.reelWidth || 95,
            symbolHeight: options.symbolHeight || 100,
            reelSpacing: options.reelSpacing || 10,
            yOffset: options.yOffset || 100,
            screenWidth: options.screenWidth || 800
        };

        // Initialize reel models
        for (let i = 0; i < this.options.numReels; i++) {
            this.reelModels.push(new ReelModel(i, this.options.numRows));
        }

        this.initialize();
    }

    private initialize(): void {
        this.stops = [];
        // Create and position reel views
        for (let i = 0; i < this.options.numReels; i++) {
            const reelView = new ReelView({
                symbolHeight: this.options.symbolHeight,
                symbolSpacing: 0,
                numRows: this.options.numRows
            }, i);
            
            // Position each reel horizontally with spacing
            reelView.x = i * (this.options.reelWidth + this.options.reelSpacing);
            
            this.reelViews.push(reelView);
            this.addChild(reelView);
        }

        // Center the entire reels container
        this.pivot.set(this.options.numReels * this.options.reelWidth / 2, this.options.numRows * this.options.symbolHeight / 2);
        this.createMask();
    }

    public generateStops(): void {
        this.stops = [];
        // Use reelModels to generate stops
        for (let i = 0; i < this.options.numReels; i++) {
            this.stops.push(this.reelModels[i].getInitialSymbols());
        }
        console.log(this.stops);
    }

    private createMask(): void {
        this.mask = new Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xffffff);
        this.addChild(this.mask);
        this.mask = this.mask;
    }

    public spin(): void {
        this.reelViews.forEach(reelView => {
            reelView.spin();
        });
    }

    public dispose(): void {
        // Clean up all reel views
        this.reelViews.forEach(reelView => {
            reelView.dispose();
        });
        this.reelViews = [];
        this.removeChildren();
    }

    public getStops(){
        return this.stops;
    }

    getNumberOfReels(){
        return this.options.numReels;
    }

}
