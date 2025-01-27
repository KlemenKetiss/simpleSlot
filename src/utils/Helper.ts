export class Helper{
    public static getRandomSymbol(): string {
        // All possible symbol names based on manifest.json
        const symbols = ['9', '10', 'J', 'Q', 'K', 'A', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BONUS'];
        // Get random index
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    public static getSymbolPayout(symbol: string, numMatches: number = 3): number {
        // Define payout values for each symbol based on number of matches (3, 4, or 5)
        const payouts: { [key: string]: { [matches: number]: number } } = {
            '9':    { 3: 5,   4: 10,  5: 20 },    // Low paying card symbols
            '10':   { 3: 5,   4: 10,  5: 20 },
            'J':    { 3: 10,  4: 20,  5: 40 },
            'Q':    { 3: 10,  4: 20,  5: 40 },
            'K':    { 3: 15,  4: 30,  5: 60 },
            'A':    { 3: 15,  4: 30,  5: 60 },
            'M1':   { 3: 20,  4: 40,  5: 80 },    // Medium paying symbols
            'M2':   { 3: 20,  4: 40,  5: 80 },
            'M3':   { 3: 25,  4: 50,  5: 100 },
            'M4':   { 3: 25,  4: 50,  5: 100 },
            'M5':   { 3: 30,  4: 60,  5: 120 },
            'M6':   { 3: 30,  4: 60,  5: 120 },
            'H1':   { 3: 40,  4: 80,  5: 160 },   // High paying symbols
            'H2':   { 3: 40,  4: 80,  5: 160 },
            'H3':   { 3: 50,  4: 100, 5: 200 },
            'H4':   { 3: 50,  4: 100, 5: 200 },
            'H5':   { 3: 100, 4: 200, 5: 400 },
            'H6':   { 3: 100, 4: 200, 5: 400 },
            'BONUS': { 3: 200, 4: 400, 5: 800 }   // Special bonus symbol
        };

        return (payouts[symbol] && payouts[symbol][numMatches]) || 0; // Return 0 if symbol or match count not found
    }

    public static checkForWinningWays(stops: Array<Array<string>>): { wins: Array<{ symbol: string, count: number, positions: Array<{reel: number, row: number}> }>, totalWin: number } {
        // Array to store all winning combinations found
        let wins: Array<{ symbol: string, count: number, positions: Array<{reel: number, row: number}> }> = [];
        // Total win amount across all winning combinations
        let totalWin = 0;

        // Keep track of symbols we've already evaluated to avoid duplicate processing
        let processedSymbols = new Set<string>();

        // Evaluate each row in the first reel as a starting point
        for (let row = 0; row < stops[0].length; row++) {
            const currentSymbol = stops[0][row];
            
            // Skip if we've already processed this symbol from another row
            if (processedSymbols.has(currentSymbol)) continue;
            processedSymbols.add(currentSymbol);

            // Initialize tracking variables for this symbol evaluation
            let consecutiveReels = 1; // Count of consecutive reels containing the symbol
            let symbolMultiplier = 1; // Multiplier based on number of symbols in each reel
            let winningPositions: Array<{reel: number, row: number}> = []; // Track positions for win highlighting
            
            // First, collect all positions of the current symbol in the first reel
            stops[0].forEach((symbol, rowIndex) => {
                if (symbol === currentSymbol) {
                    winningPositions.push({reel: 0, row: rowIndex});
                }
            });

            // Count how many times the symbol appears in the first reel
            // This forms the base of our multiplier calculation
            let firstReelCount = stops[0].filter(s => s === currentSymbol).length;
            symbolMultiplier *= firstReelCount;

            // Check subsequent reels for the same symbol
            for (let reel = 1; reel < stops.length; reel++) {
                // Count occurrences of our symbol in this reel
                const symbolsInReel = stops[reel].filter(s => s === currentSymbol).length;
                
                if (symbolsInReel > 0) {
                    // If symbol exists in this reel, collect all its positions
                    stops[reel].forEach((symbol, rowIndex) => {
                        if (symbol === currentSymbol) {
                            winningPositions.push({reel, row: rowIndex});
                        }
                    });
                    
                    consecutiveReels++; // Increment our consecutive reel counter
                    symbolMultiplier *= symbolsInReel; // Multiply by number of symbols in this reel
                } else {
                    // If we don't find the symbol, stop checking further reels
                    break;
                }
            }

            // Only process wins of 3 or more consecutive reels
            if (consecutiveReels >= 3) {
                // Get the base payout for this symbol and number of consecutive reels
                const baseWin = Helper.getSymbolPayout(currentSymbol, consecutiveReels);
                // Calculate total win by multiplying base win by our accumulated multiplier
                const totalSymbolWin = baseWin * symbolMultiplier;
                totalWin += totalSymbolWin;
                
                // Record this winning combination
                wins.push({
                    symbol: currentSymbol,
                    count: consecutiveReels,
                    positions: winningPositions
                });
            }
        }

        // Return both the winning combinations and total win amount
        return {
            wins,
            totalWin
        };
    }
}

