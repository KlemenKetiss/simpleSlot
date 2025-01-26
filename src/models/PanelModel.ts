export class PanelModel {
    private balance: number;
    private win: number;

    constructor(initialBalance: number = 1000) {
        this.balance = initialBalance;
        this.win = 0;
    }

    public getBalance(): number {
        return this.balance;
    }

    public getWin(): number {
        return this.win;
    }

    public updateBalance(newBalance: number): void {
        this.balance = newBalance;
    }

    public updateWin(newWin: number): void {
        this.win = newWin;
    }
}