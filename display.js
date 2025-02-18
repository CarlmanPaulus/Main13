function displayAIHands(AIhands) {
    Object.entries(AIhands).forEach(([playerId, handData]) => {
        displayPlayerHand(playerId, handData); // Display AI players (player1, player2, player3)
    });
}

function displayPlayerHand(playerId, handData) {
    const playerDiv = document.getElementById(playerId);
    if (!playerDiv) return; // Prevent errors if div is missing

    playerDiv.innerHTML = `<h3></h3>`; // Player name

    // Define the order of hands (backHand at bottom, midHand in middle, frontHand on top)
    const handOrder = ["frontHand", "midHand", "backHand"];

    handOrder.forEach(handKey => {
        if (!handData[handKey]) return; // Skip if hand data is missing

        const handDiv = document.createElement("div");
        handDiv.classList.add("hand-section");

        // Determine the hand combination name dynamically
        const handName = findHandRank(handData[handKey]);

        // Add hand label with actual poker combination
        const label = document.createElement("span");
        label.innerText = handName;
        label.classList.add("hand-label");
        handDiv.appendChild(label);

        // Sort the cards within the hand by their rank (value)
        handData[handKey] = sortHandByRank(handData[handKey]);

        // Display each card in sorted order
        handData[handKey].forEach(card => {
            if (!card) return; // Prevent undefined cards
            let img = document.createElement("img");
            img.src = card.image; // Image from card object
            img.alt = `${card.rank}${card.suit}`;
            img.classList.add("card");
            handDiv.appendChild(img);
        });

        playerDiv.appendChild(handDiv); // Append to player's div
    });
}

// Function to find hand rank dynamically
function findHandRank(hand) {
    if (!hand || hand.length === 0) return "Empty Hand";

    // Sort hand by value (Descending)
    let sortedHand = hand.slice().sort((a, b) => b.value - a.value);
    let values = sortedHand.map(card => card.value);
    let suits = sortedHand.map(card => card.suit);
    let uniqueValues = [...new Set(values)];
    let uniqueSuits = [...new Set(suits)];

    // Check for specific hand rankings
    let isFlush = uniqueSuits.length === 1;
    let isStraight = uniqueValues.length === hand.length &&
                     (Math.max(...values) - Math.min(...values) === hand.length - 1);

    if (hand.length === 5) { // 5-card hands (Back & Mid)
        if (isFlush && isStraight && Math.max(...values) === 14) return "Royal Flush";
        if (isFlush && isStraight) return "Straight F.";
        if (hasNOfAKind(values, 4)) return "Four oaK";
        if (hasFullHouse(values)) return "Full H.";
        if (isFlush) return "Flush";
        if (isStraight) return "Straight";
        if (hasNOfAKind(values, 3)) return "Three oaK";
        if (hasTwoPairs(values)) return "Two Pair";
        if (hasNOfAKind(values, 2)) return "One Pair";
    } else if (hand.length === 3) { // 3-card hand (Front)
        if (hasNOfAKind(values, 3)) return "Three oaK";
        if (hasNOfAKind(values, 2)) return "One Pair";
    }

    return `High Card ${getCardRankAi(sortedHand[0])}`;
}

// Helper functions for hand detection
function hasNOfAKind(values, n) {
    return values.some(value => values.filter(v => v === value).length === n);
}

function hasFullHouse(values) {
    return hasNOfAKind(values, 3) && hasNOfAKind(values, 2);
}

function hasTwoPairs(values) {
    let pairCount = values.filter((v, i, arr) => arr.indexOf(v) !== i).length;
    return pairCount >= 2;
}

function getCardRankAi(card) {
    return card.rank === "A" ? "A" :
           card.rank === "K" ? "K" :
           card.rank === "Q" ? "Q" :
           card.rank === "J" ? "J" :
           card.rank === "T" ? "10" :
           card.rank;
}

// Function to sort hand cards by rank (value)
function sortHandByRank(hand) {
    return hand.slice().sort((a, b) => {
        if (a.value === b.value) {
            return a.suit.localeCompare(b.suit); // If values are the same, sort by suit
        }
        return b.value - a.value; // Otherwise, sort by value
    });
}
