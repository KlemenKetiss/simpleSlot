import { Container, Text, Graphics } from 'pixi.js';
import { GAME_HEIGHT } from '../utils/Constants';
import { MainView } from './MainView';
import { gsap } from 'gsap';
export class PanelView extends Container {
    private spinButton!: Graphics;
    private balanceText!: Text;
    private winText!: Text;
    private balance: number = 1000; // Starting balance
    constructor() {
        super();
        this.initialize();
        
    }

    private initialize(): void {
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
            text: 'WIN: 0',
            style: {
                fontSize: 24,
                fill: 0xFFFFFF,
            }
        });
        this.winText.position.set(-300, GAME_HEIGHT/2 - 200);
    }

    private setSpinButtonFunctionality(): void {    
        this.spinButton.on('pointerdown', () => {
            if (MainView.getInstance.isSpinning()) return;
            this.spinButton.interactive = false;
            this.emit('spinButtonClicked');
            this.spinButton.alpha = 0.5;
        });
        this.on('spinConcluded', () => {
            this.enableSpinButton();
        });
    }

    public enableSpinButton(){
        this.spinButton.alpha = 1;
        this.spinButton.interactive = true;
    }

    public updateBalance(newBalance: number): void {
        this.balance = newBalance;
        this.balanceText.text = `Balance: ${this.balance}`;
    }

    public updateWin(newWin: number): void {
        this.winText.text = `Win: ${newWin}`;
    }

    public dispose(): void {
        this.removeChildren();
        this.spinButton.removeAllListeners();
    }
}
