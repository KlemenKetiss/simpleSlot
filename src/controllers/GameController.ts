import { GameModel } from '../models/GameModel';
import { MainView } from '../views/MainView';

export class GameController {
    private static instance: GameController;
    private gameModel: GameModel;
    
    private constructor() {
        this.gameModel = new GameModel(5, 3);
    }

    public static get getInstance(): GameController {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }

    public initialize(mainView: MainView): void {
        // Initialize event listeners after MainView is ready
        mainView.panelView.on('spinButtonClicked', () => {
            if (!this.gameModel.getIsSpinning()) {
                this.gameModel.startSpin();
            }
        });

        mainView.panelView.on('spinConcluded', () => {
            this.gameModel.endSpin();
        });
    }

    public isSpinning(): boolean {
        return this.gameModel.getIsSpinning();
    }

    public startSpin(): void {
        this.gameModel.startSpin();
    }

    public endSpin(): void {
        this.gameModel.endSpin();
    }

    public getGameModel(): GameModel {
        return this.gameModel;
    }
}
