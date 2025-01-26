import { GAME_HEIGHT } from './utils/Constants';
import { GAME_WIDTH } from './utils/Constants';
import { MainView } from './views/MainView';
import { Application, Assets } from 'pixi.js';

export class Slot {
    private app: Application;
    public mainView!: MainView;
    constructor() {
        this.app = new Application();

        this.app.init({
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: 0x1099bb,
            antialias: true,
        }).then(async () => {
            document.body.appendChild(this.app.canvas);
            try {
                await Assets.init({manifest: "./assets/manifest.json"});
                console.log('Assets manifest loaded successfully');
            } catch (error) {
                console.error('Failed to load assets manifest:', error);
                throw error;
            }
            await Assets.loadBundle('game-bundle');
            this.initialize();
        });
    }

    public initialize(): void {
        this.mainView = MainView.getInstance;
        this.app.stage.addChild(this.mainView);

    }
}