import { ReelModel } from './ReelModel';
import { MainView } from '../views/MainView';

export class GameModel {
    private reelModels: ReelModel[];
    private isSpinning: boolean;
    private numberOfReels: number;
    private numberOfRows: number;

    constructor(numberOfReels: number, numberOfRows: number) {
        this.numberOfReels = numberOfReels;
        this.numberOfRows = numberOfRows;
        this.isSpinning = false;
        
        // Initialize reel models
        this.reelModels = [];
        for (let i = 0; i < numberOfReels; i++) {
            this.reelModels.push(new ReelModel(i, numberOfRows));
        }
    }

    public startSpin(): void {
        if (!this.isSpinning) {
            this.isSpinning = true;
            MainView.getInstance.reelsView.generateStops();
            MainView.getInstance.reelsView.spin();
        }
    }

    public endSpin(): void {
        this.isSpinning = false;
        MainView.getInstance.panelView.enableSpinButton();
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }

    public getReelModel(index: number): ReelModel {
        return this.reelModels[index];
    }

    public getNumberOfReels(): number {
        return this.numberOfReels;
    }

    public getNumberOfRows(): number {
        return this.numberOfRows;
    }
}