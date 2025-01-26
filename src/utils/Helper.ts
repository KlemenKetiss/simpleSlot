export class Helper{
    public static getRandomSymbol(): string {
        // All possible symbol names based on manifest.json
        const symbols = ['9', '10', 'J', 'Q', 'K', 'A', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BONUS'];
        // Get random index
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
}

