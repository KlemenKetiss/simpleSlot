import { Container, Text, Graphics } from 'pixi.js';
import { GAME_HEIGHT } from '../utils/Constants';
import { MainView } from './MainView';
import { gsap } from 'gsap';
import { Helper } from '../utils/Helper';
export class PanelView extends Container {
    private spinButton!: Graphics;
    private balanceText!: Text;
    private winText!: Text;
    private balance: number = 1000; // Starting balance
    public spinActive!: boolean;
    constructor() {
        super();
        this.initialize();
        
    }

    private initialize(): void {
        this.spinActive = false;
        this.initSpinButton();
        this.initBalanceText();
        this.initWinText();

        // Add elements to container
        this.addChild(this.spinButton);
        this.addChild(this.balanceText);
        this.addChild(this.winText);
    }

    private initSpinButton(): void {
        // Create spin button
        this.spinButton = new Graphics();
        this.spinButton.roundRect(0, 0, 120, 50, 10);
        
        // Make button interactive
        this.spinButton.interactive = true;
        this.spinButton.cursor = 'pointer';

        // Add spin text
        const spinText = new Text({
            text: 'SPIN',
            style: {
                fontSize: 24,
                fill: 0xFFFFFF,
            }
        });

        spinText.anchor.set(0.5);
        spinText.position.set(60, 25);
        this.spinButton.addChild(spinText);
        this.spinButton.position.set(-this.spinButton.width/2, GAME_HEIGHT/2 - 200 - this.spinButton.height/2);

        this.setSpinButtonFunctionality();
    }

    private initBalanceText(): void {
        // Create balance text
        this.balanceText = new Text({
            text: `Balance: ${this.balance}`,
            style: {
                fontSize: 24,
                fill: 0xFFFFFF,
            }
        });
        this.balanceText.position.set(300, GAME_HEIGHT/2 - 200);
    }

    private initWinText(): void {
        // Create win text
        this.winText = new Text({
            text: 'Win: 0',
            style: {
                fontSize: 24,
                fill: 0xFFFFFF,
            }
        });
        this.winText.position.set(-300, GAME_HEIGHT/2 - 200);
    }

    private setSpinButtonFunctionality(): void {    
        this.spinButton.on('pointerdown', () => {
            if (this.spinActive) return;
            this.spinButton.interactive = false;
            MainView.getInstance.reelsView.emit('spinButtonClicked');
            this.spinButton.alpha = 0.5;
            this.updateBalance(-10);
        });
        this.on('spinConcluded', () => {
            this.enableSpinButton();
            this.calculateWin();
        });
    }

    public enableSpinButton(){
        this.spinActive = false;
        this.spinButton.alpha = 1;
        this.spinButton.interactive = true;
    }

    public updateBalance(win: number): void {
        this.balance = this.balance + win;
        this.balanceText.text = `Balance: ${this.balance}`;
    }

    public updateWin(newWin: number): void {
        this.winText.text = `Win: ${newWin}`;
    }

    public calculateWin(): void {
        const stops = MainView.getInstance.reelsView.getStops();
        const { wins, totalWin } = Helper.checkForWinningWays(stops);
        this.updateWin(totalWin);
        this.updateBalance(totalWin);
        // Highlight winning symbols
        wins.forEach(win => {
            win.positions.forEach(position => {
                MainView.getInstance.reelsView.playWinAnimations(position.reel, position.row);
            });
        });
    }

    public dispose(): void {
        this.removeChildren();
        this.spinButton.removeAllListeners();
    }
}
