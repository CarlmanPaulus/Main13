function strongestHand(playerCards) {
    let bestHands = {}; // Store the best hands for each player

    Object.keys(playerCards).forEach(player => {
        let cards = [...playerCards[player]]; // Copy player's 13 cards

        // Step 1: Find the strongest first 5-card hand (Backhand)
        let backHand = findStrongestCombination(cards);
        
        // Step 2: Remove those 5 cards from the original 13
        let remainingCards = cards.filter(card =>
            !backHand.some(selected => selected.rank === card.rank && selected.suit === card.suit)
        );

        // Step 3: Find the strongest second 5-card hand (Midhand) from remaining 8 cards
        let midHand = findStrongestCombination(remainingCards);

        // Step 4: Remaining 3 cards become Fronthand
        let frontHand = remainingCards.filter(card =>
            !midHand.some(selected => selected.rank === card.rank && selected.suit === card.suit)
        );

        // Step 5: Store all hands
        bestHands[player] = {
            backHand: backHand,
            midHand: midHand,
            frontHand: frontHand
        };
    });

    return bestHands;
}

// Function to find the strongest 5-card combination based on hand rankings
function findStrongestCombination(cards) {
    let combinations = generateCombinations(cards, 5); // Generate all possible 5-card hands

    return combinations.reduce((strongest, currentHand) => {
        let currentRank = evaluateHandRank(currentHand);
        let strongestRank = evaluateHandRank(strongest);

        return currentRank > strongestRank ? currentHand : strongest;
    }, combinations[0]);
}

// Function to evaluate hand strength based on Chinese Poker rules
function evaluateHandRank(hand) {
    if (isRoyalFlush(hand)) return 9;
    if (isStraightFlush(hand)) return 8;
    if (isFourOfAKind(hand)) return 7;
    if (isFullHouse(hand)) return 6;
    if (isFlush(hand)) return 5;
    if (isStraight(hand)) return 4;
    if (isThreeOfAKind(hand)) return 3;
    if (isTwoPair(hand)) return 2;
    if (isPair(hand)) return 1;
    return 0;  // High card
}



// Helper function to generate all possible combinations of k cards from an array
function generateCombinations(cards, k) {
    let results = [];
    
    function helper(start, path) {
        if (path.length === k) {
            results.push([...path]);
            return;
        }
        for (let i = start; i < cards.length; i++) {
            path.push(cards[i]);
            helper(i + 1, path);
            path.pop();
        }
    }
    
    helper(0, []);
    return results;
}
