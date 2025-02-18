function isRoyalFlush(hand) {
    return isStraightFlush(hand) && hand.some(card => card.rank === "A");
}

function isStraightFlush(hand) {
return isFlush(hand) && isStraight(hand);
}

function isFourOfAKind(hand) {
    let counts = countRanks(hand);
    return Object.values(counts).includes(4);
}

function isFullHouse(hand) {
    let counts = countRanks(hand);
    return Object.values(counts).includes(3) && Object.values(counts).includes(2);
}

function isFlush(hand) {
    return hand.every(card => card.suit === hand[0].suit);
}

function isStraight(hand) {
    let values = hand.map(card => card.value).sort((a, b) => a - b);
    return values.every((v, i) => i === 0 || v === values[i - 1] + 1);
}

function isThreeOfAKind(hand) {
    let counts = countRanks(hand);
    return Object.values(counts).includes(3);
}

function isTwoPair(hand) {
    let counts = countRanks(hand);
    return Object.values(counts).filter(v => v === 2).length === 2;
}

function isPair(hand) {
    let counts = countRanks(hand);
    return Object.values(counts).includes(2);
}

// Helper to count occurrences of ranks
function countRanks(hand) {
    let counts = {};
    hand.forEach(card => {
        counts[card.rank] = (counts[card.rank] || 0) + 1;
    });
    return counts;
}
/////////
// Function to compare two hands based on hand strength
function compareHands(handA, handB) {
    let rankA = evaluateHandRank(handA);
    let rankB = evaluateHandRank(handB);

    // Detect if it's a Front Hand (3 cards only)
    const isFrontHandA = handA.length === 3;
    const isFrontHandB = handB.length === 3;

    // If it's a Front Hand, it can only be Three of a Kind, One Pair, or High Card
    if (isFrontHandA && rankA > 3) rankA = 0; // Downgrade invalid hands to High Card
    if (isFrontHandB && rankB > 3) rankB = 0; // Downgrade invalid hands to High Card

    if (rankA > rankB) return "✅";
    if (rankA < rankB) return "❌";

    // If ranks are the same, apply tiebreakers based on hand type
    switch (rankA) {
        case 9: return compareRoyalFlush(handA, handB);
        case 8: return compareStraightFlush(handA, handB);
        case 7: return compareFourOfAKind(handA, handB);
        case 6: return compareFullHouse(handA, handB);
        case 5: return compareFlush(handA, handB);
        case 4: return compareStraight(handA, handB); 
        case 3: return compareThreeOfAKind(handA, handB);
        case 2: return compareTwoPair(handA, handB);
        case 1: return compareOnePair(handA, handB);
        case 0: return compareHighCard(handA, handB);
        default: return "Tie 🤝";
    }
}

// Compare Royal Flush (decided by suit: Spades > Hearts > Clubs > Diamonds)
function compareRoyalFlush(handA, handB) {
    return compareByHighestSuit(handA, handB);
}

// Compare Straight Flush (higher high card wins; if same, highest suit)
function compareStraightFlush(handA, handB) {
    const highCardA = getHighestCard(handA);
    const highCardB = getHighestCard(handB);

    if (highCardA.value > highCardB.value) return "✅";
    if (highCardA.value < highCardB.value) return "❌";

    return compareByHighestSuit(handA, handB);
}

// Compare Four of a Kind (only by rank, NO suit comparison)
function compareFourOfAKind(handA, handB) {
    const fourA = getFourOfAKindRank(handA);
    const fourB = getFourOfAKindRank(handB);

    if (fourA > fourB) return "✅";
    if (fourA < fourB) return "❌";

    return "Tie 🤝"; // No need for further tiebreaker
}

// Get the rank of the Four of a Kind in the hand
function getFourOfAKindRank(hand) {
    const rankCounts = {};
    hand.forEach(card => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });

    return parseInt(Object.keys(rankCounts).find(rank => rankCounts[rank] === 4));
}

// Compare by highest suit (Spades > Hearts > Clubs > Diamonds)
function compareByHighestSuit(handA, handB) {
    const suitRanking = { "S": 4, "H": 3, "C": 2, "D": 1 };

    const highestSuitA = Math.max(...handA.map(card => suitRanking[card.suit]));
    const highestSuitB = Math.max(...handB.map(card => suitRanking[card.suit]));

    if (highestSuitA > highestSuitB) return "✅";
    if (highestSuitA < highestSuitB) return "❌";

    return "Tie 🤝";
}

// Get the highest card in a hand
function getHighestCard(hand) {
    return hand.reduce((maxCard, card) => (card.value > maxCard.value ? card : maxCard), hand[0]);
}

// Compare Full House (higher three-of-a-kind value wins, then the pair)
function compareFullHouse(handA, handB) {
    const tripleA = getThreeOfAKindRank(handA);
    const tripleB = getThreeOfAKindRank(handB);

    if (tripleA > tripleB) return "✅";
    if (tripleA < tripleB) return "❌";

    return "Tie 🤝"; // Identical Full House (only possible with multiple decks)
}

function getThreeOfAKindRank(hand) {
    const rankCounts = countRanks(hand);
    const rankToValue = { "A": 14, "K": 13, "Q": 12, "J": 11, "T": 10 };

    const triple = Object.keys(rankCounts).find(rank => rankCounts[rank] === 3);
    return triple ? (rankToValue[triple] || Number(triple)) : null;
}

function countRanks(hand) {
    let counts = {};
    hand.forEach(card => {
        counts[card.rank] = (counts[card.rank] || 0) + 1;
    });
    return counts;
}






// Function to compare flush ties
function compareFlush(handA, handB) {
    // Sort flush cards by value (descending)
    const sortedA = handA.sort((a, b) => b.value - a.value);
    const sortedB = handB.sort((a, b) => b.value - a.value);

    // Compare cards from highest to lowest
    for (let i = 0; i < 5; i++) {
        if (sortedA[i].value > sortedB[i].value) return "✅";
        if (sortedA[i].value < sortedB[i].value) return "❌";
    }

    // If all five values are the same, compare suits
    const suitRank = { "S": 4, "H": 3, "C": 2, "D": 1 };

    for (let i = 0; i < 5; i++) {
        if (suitRank[sortedA[i].suit] > suitRank[sortedB[i].suit]) return "✅";
        if (suitRank[sortedA[i].suit] < suitRank[sortedB[i].suit]) return "❌";
    }

    return "Tie 🤝"; // Identical flush (extremely rare)
}

// Function to compare Three of a Kind hands
function compareThreeOfAKind(handA, handB) {
    const toakValueA = getThreeOfAKindValue(handA);
    const toakValueB = getThreeOfAKindValue(handB);

    if (toakValueA > toakValueB) return "✅";
    if (toakValueA < toakValueB) return "❌";

    return "Tie 🤝"; // Identical Three of a Kind (very rare)
}

// Helper function to get the value of Three of a Kind
function getThreeOfAKindValue(hand) {
    let valueCounts = {};
    hand.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });

    return parseInt(Object.keys(valueCounts).find(value => valueCounts[value] === 3));
}

// Function to compare Two Pair hands
function compareTwoPair(handA, handB) {
    const { highPair: highA, lowPair: lowA, kicker: kickerA } = getTwoPairValues(handA);
    const { highPair: highB, lowPair: lowB, kicker: kickerB } = getTwoPairValues(handB);

    if (highA > highB) return "✅";
    if (highA < highB) return "❌";

    if (lowA > lowB) return "✅";
    if (lowA < lowB) return "❌";

    if (kickerA.value > kickerB.value) return "✅";
    if (kickerA.value < kickerB.value) return "❌";

    // If everything else is the same, decide by suit of the kicker
    return compareSuit(kickerA.suit, kickerB.suit);
}

// Helper function to extract two pairs and kicker from hand
function getTwoPairValues(hand) {
    let valueCounts = {};
    hand.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });

    let pairs = Object.keys(valueCounts)
        .filter(value => valueCounts[value] === 2)
        .map(value => parseInt(value))
        .sort((a, b) => b - a); // Sort pairs in descending order

    let kicker = hand.find(card => valueCounts[card.value] === 1); // Find single card

    return {
        highPair: pairs[0],
        lowPair: pairs[1],
        kicker: kicker
    };
}


// Function to compare One Pair hands
function compareOnePair(handA, handB) {
    const { pair: pairA, kickers: kickersA } = getOnePairValues(handA);
    const { pair: pairB, kickers: kickersB } = getOnePairValues(handB);
    
    if (pairA > pairB) return "✅";
    if (pairA < pairB) return "❌";
    
    // Compare highest kicker
    if (kickersA[0].value > kickersB[0].value) return "✅";
    if (kickersA[0].value < kickersB[0].value) return "❌";
    
    // Compare second highest kicker
    if (kickersA[1].value > kickersB[1].value) return "✅";
    if (kickersA[1].value < kickersB[1].value) return "❌";
    
    // Compare lowest kicker
    if (kickersA[2].value > kickersB[2].value) return "✅";
    if (kickersA[2].value < kickersB[2].value) return "❌";
    
    // If all kickers are the same, decide by suit of the lowest kicker
    return compareSuit(kickersA[2].suit, kickersB[2].suit);
}

// Helper function to extract one pair and kickers from hand
function getOnePairValues(hand) {
    let valueCounts = {};
    hand.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });
    
    let pairValue = parseInt(Object.keys(valueCounts).find(value => valueCounts[value] === 2));
    let kickers = hand
    .filter(card => card.value !== pairValue) // Exclude pair cards
    .sort((a, b) => b.value - a.value); // Sort kickers in descending order
    
    return {
        pair: pairValue,
        kickers: kickers
    };
}

// Function to convert card rank to numerical value
function getCardValue(rank) {
    const rankToValue = { "A": 14, "K": 13, "Q": 12, "J": 11, "T": 10 };
    return rankToValue[rank] || parseInt(rank, 10) || 0; // Ensure valid number
}

// Function to compare suits (♠ > ♥ > ♣ > ♦)
function compareSuit(suitA, suitB) {
    const suitRank = { "S": 4, "H": 3, "C": 2, "D": 1 };
    return suitRank[suitA] > suitRank[suitB] ? "✅" : "❌";
}

// Function to compare High Card hands
function compareHighCard(handA, handB) {
    // Sort hands in descending order based on card value
    const sortedA = [...handA].sort((a, b) => getCardValue(b.rank) - getCardValue(a.rank));
    const sortedB = [...handB].sort((a, b) => getCardValue(b.rank) - getCardValue(a.rank));

    // Get the highest card from both hands
    const highCardA = sortedA[0];
    const highCardB = sortedB[0];

    // Compare the high card rank
    if (getCardValue(highCardA.rank) > getCardValue(highCardB.rank)) {
        return "✅";
    }
    if (getCardValue(highCardA.rank) < getCardValue(highCardB.rank)) {
        return "❌";
    }

    // If ranks are the same, compare the suits
    return compareSuit(highCardA.suit, highCardB.suit);
}

// Function to compare Straight hands
function compareStraight(handA, handB) {
    const sortedA = [...handA].sort((a, b) => getCardValue(b.rank) - getCardValue(a.rank));
    const sortedB = [...handB].sort((a, b) => getCardValue(b.rank) - getCardValue(a.rank));

    for (let i = 0; i < sortedA.length; i++) {
        const valueA = getCardValue(sortedA[i].rank);
        const valueB = getCardValue(sortedB[i].rank);

        if (valueA > valueB) return "✅";
        if (valueA < valueB) return "❌";
    }

    // If all values are the same, compare suits
    return compareSuit(sortedA[0].suit, sortedB[0].suit);
}

