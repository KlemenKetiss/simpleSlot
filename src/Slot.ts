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
        window.addEventListener('resize', () => this.onResize());
    }

    public initialize(): void {
        this.mainView = MainView.getInstance;
        this.app.stage.addChild(this.mainView);
        this.onResize();
    }

    private onResize(): void {
        // Update app renderer size
        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        // Calculate scale to fit the view
        const scaleX = window.innerWidth / (GAME_WIDTH/2);
        const scaleY = window.innerHeight / (GAME_HEIGHT/2);
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

        // Apply scale and center
        this.mainView.scale.set(scale);
        this.mainView.x = window.innerWidth / 2;
        this.mainView.y = window.innerHeight / 2;
    }
}