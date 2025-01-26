import { Container } from 'pixi.js';
import { ReelsView } from './ReelsView';
import { PanelView } from './PanelView';
import { GAME_HEIGHT } from '../utils/Constants';
import { GAME_WIDTH } from '../utils/Constants';

export class MainView extends Container {
    protected static instance: MainView;
    public reelsView!: ReelsView;
    public panelView!: PanelView;

    private constructor() {
        super();
        this.initialize();
    }

    public static get getInstance(): MainView {
        if (!MainView.instance) {
            MainView.instance = new MainView();
        }
        return MainView.instance;
    }

    private initialize(): void {
        // Set the container to be interactive to handle input events
        this.interactive = true;
        
        // Position the container in the center of the screen
        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        // Add a simple graphic to visualize MainView loading
        console.log('MainView initialized');
        if (MainView.instance == null) MainView.instance = this;

        this.addReelsView();
        this.addPanelView();
    }

    private addReelsView(): void {
        this.reelsView = new ReelsView({numReels: 5, numRows: 3});
        this.addChild(this.reelsView);
    }

    private addPanelView(): void {
        this.panelView = new PanelView();
        this.addChild(this.panelView);
    }

}
