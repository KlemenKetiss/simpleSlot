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
        let wins: Array<{ symbol: string, count: number, positions: Array<{reel: number, row: number}> }> = [];
        let totalWin = 0;

        // Track symbols we've already processed
        let processedSymbols = new Set<string>();

        // For each unique symbol in first reel
        for (let row = 0; row < stops[0].length; row++) {
            const currentSymbol = stops[0][row];
            
            // Skip if we've already processed this symbol
            if (processedSymbols.has(currentSymbol)) continue;
            processedSymbols.add(currentSymbol);

            // Count consecutive reels with the symbol
            let consecutiveReels = 1;
            let symbolMultiplier = 1;
            let winningPositions: Array<{reel: number, row: number}> = [];
            
            // Add positions from first reel
            stops[0].forEach((symbol, rowIndex) => {
                if (symbol === currentSymbol) {
                    winningPositions.push({reel: 0, row: rowIndex});
                }
            });

            // Count occurrences in first reel
            let firstReelCount = stops[0].filter(s => s === currentSymbol).length;
            symbolMultiplier *= firstReelCount;

            // Check consecutive reels
            for (let reel = 1; reel < stops.length; reel++) {
                const symbolsInReel = stops[reel].filter(s => s === currentSymbol).length;
                
                if (symbolsInReel > 0) {
                    // Add positions for this reel
                    stops[reel].forEach((symbol, rowIndex) => {
                        if (symbol === currentSymbol) {
                            winningPositions.push({reel, row: rowIndex});
                        }
                    });
                    
                    consecutiveReels++;
                    symbolMultiplier *= symbolsInReel;
                } else {
                    break;
                }
            }

            // If we have 3 or more consecutive reels
            if (consecutiveReels >= 3) {
                const baseWin = Helper.getSymbolPayout(currentSymbol, consecutiveReels);
                const totalSymbolWin = baseWin * symbolMultiplier;
                totalWin += totalSymbolWin;
                
                wins.push({
                    symbol: currentSymbol,
                    count: consecutiveReels,
                    positions: winningPositions
                });
            }
        }

        return {
            wins,
            totalWin
        };
    }
}

