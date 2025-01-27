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
        this.createForceButtons();

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
                fontSize: 28,
                fill: 0xFFFFFF,
                fontWeight: 'bold',
                fontFamily: 'Arial',
                letterSpacing: 2,
                dropShadow: {
                    alpha: 1,
                    color: '#000000', 
                    blur: 4,
                    angle: Math.PI/6,
                    distance: 2
                },
            }
        });

        spinText.anchor.set(0.5);
        spinText.position.set(-15, 25);
        this.spinButton.addChild(spinText);
        this.spinButton.position.set((this.spinButton.width/2), (GAME_HEIGHT/2) - (this.spinButton.height/2) - 300);

        this.setSpinButtonFunctionality();
    }

    private initBalanceText(): void {
        // Create balance text
        this.balanceText = new Text({
            text: `Credits: ${this.balance} €`,
            style: {
                fontSize: 24,
                fill: 0xFFFFFF,
            }
        });
        this.balanceText.position.set(-230, GAME_HEIGHT/2 - 200);
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
        this.winText.position.set(230, GAME_HEIGHT/2 - 200);
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
            MainView.getInstance.reelsView.forceStops = [];
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
        this.balanceText.text = `Credits: ${this.balance} €`;
    }

    public updateWin(newWin: number): void {
        this.winText.text = `Win: ${newWin} €`;
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

    private createForceButtons(): void {
        const buttonStyle = {
            fontSize: 24,
            fill: 0xFFFFFF,
        };

        // Create and position bet buttons
        for (let i = 1; i <= 3; i++) {
            const button = new Container();
            
            // Create button background
            const bg = new Graphics().roundRect(0, 0, 50, 50, 10);
            bg.fill(0x4cb84c);
            
            // Create button text
            const text = new Text({
                text: `${i}.`,
                style: buttonStyle
            });
            text.anchor.set(0.5);
            text.position.set(25, 25);
            
            button.addChild(bg, text);
            button.position.set(-300, -30+(i - 2) * 60); // Center vertically with 60px spacing
            
            // Make button interactive
            button.eventMode = 'static';
            button.cursor = 'pointer';
            button.on('pointerdown', () => {
                // Visual feedback
                button.alpha = 0.5;

                if(i == 1){
                    MainView.getInstance.reelsView.forceStops = Helper.getForceStops(0);
                }
                if(i == 2){
                    MainView.getInstance.reelsView.forceStops = Helper.getForceStops(1);
                }
                if(i == 3){
                    MainView.getInstance.reelsView.forceStops = Helper.getForceStops(2);
                }
            });
            button.on('pointerup', () => {
                button.alpha = 1;
            });
            this.addChild(button);
        }
    }

    public dispose(): void {
        this.removeChildren();
        this.spinButton.removeAllListeners();
    }
}
