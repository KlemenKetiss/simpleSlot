import { Container, Graphics } from 'pixi.js';
import { ReelView } from './ReelView';
import { Helper } from '../utils/Helper';
import { gsap } from 'gsap';
import { MainView } from './MainView';
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
        this.on('spinButtonClicked', () => {
            console.log(MainView.getInstance.panelView.spinActive)
            if(!MainView.getInstance.panelView.spinActive){
                MainView.getInstance.panelView.spinActive = true;
                this.generateStops();
                this.spin();
            }
        });
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

    private createMask(): void {
        // Create a graphics object to define our mask
        this.mask = new Graphics()
            .rect(0, 0, this.width, this.height)
            .fill(0xffffff);

        // Add the mask to the container
        this.addChild(this.mask);
        // Set the mask
        this.mask = this.mask;
    }

    public spin(): void {
        // Spin reels sequentially with slight delay between each
        this.reelViews.forEach(reelView => {
            reelView.spin();
        });
    }

    private generateStops(){
        this.stops = [];
        // Create a 2D array of stops for each reel
        for (let i = 0; i < this.options.numReels; i++) {
            let tmp = []
            for (let j = 0; j < this.options.numRows; j++) {
                tmp.push(Helper.getRandomSymbol());
            }
            this.stops.push(tmp)
        }
/*        this.stops = [
        ['H6', 'H6', 'H6'],
        ['H6', 'H6', 'H6'],
        ['H6', 'H6', 'H6'],
        ['H6', 'H6', 'H6'],
        ['H6', 'H6', 'H6']
       ]  */ 
    }

    public playWinAnimations(reel: number, row: number): void {
        const reelView = this.reelViews[reel];
        const symbolView = reelView.getSymboInRow(row);
        if (symbolView) {
            symbolView.playWinAnimation();
        }
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

    public getReelViews(){
        return this.reelViews;
    }

    getNumberOfReels(){
        return this.options.numReels;
    }

}
