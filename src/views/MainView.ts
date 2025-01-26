import { Container } from 'pixi.js';
import { ReelsView } from './ReelsView';
import { PanelView } from './PanelView';
import { GAME_HEIGHT } from '../utils/Constants';
import { GAME_WIDTH } from '../utils/Constants';
import { GameModel } from '../models/GameModel';
import { PanelController } from '../controllers/PanelController';
import { PanelModel } from '../models/PanelModel';
import { GameController } from '../controllers/GameController';

export class MainView extends Container {
    protected static instance: MainView;
    public reelsView!: ReelsView;
    public panelView!: PanelView;
    private gameModel!: GameModel;
    // Add controllers but keep existing structure
    private gameController!: GameController;
    private panelController!: PanelController;

    private constructor() {
        super();
        // Initialize in same order as before
        // Get GameController instance first
        this.gameController = GameController.getInstance;
        this.initialize();        
    }

    public static get getInstance(): MainView {
        if (!MainView.instance) {
            MainView.instance = new MainView();
        }
        return MainView.instance;
    }

    private initialize(): void {
        this.interactive = true;
        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        if (MainView.instance == null) MainView.instance = this;

        // Add views in order
        this.addReelsView();
        this.addPanelView();
        
        // Initialize controller after views are ready
        this.gameController.initialize(this);
    }

    private addReelsView(): void {
        const gameModel = this.gameController.getGameModel();
        this.reelsView = new ReelsView({
            numReels: gameModel.getNumberOfReels(),
            numRows: gameModel.getNumberOfRows()
        });
        this.addChild(this.reelsView);
    }

    private addPanelView(): void {
        this.panelView = new PanelView();
        this.addChild(this.panelView);
    }

    public isSpinning(): boolean {
        return this.gameController.isSpinning();
    }

}
