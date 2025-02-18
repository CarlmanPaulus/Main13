// Track selected hands
let backHand = [];
let midHand = [];
let frontHand = [];
let userDeck = []; // Store deck cards separately
let sortMode = "suit"; // Start with sorting by rank

function displayUserHand(userCards) {
    resetHands(); // Reset all hands before displaying

    const userDiv = document.getElementById("player4");
    if (!userDiv) return;

    userDiv.innerHTML = ``;

    // Create hand sections
    const hands = {
        frontHand: createHandSection("Front Hand (3)", "frontHand"),
        midHand: createHandSection("Mid Hand (5)", "midHand"),
        backHand: createHandSection("Back Hand (5)", "backHand"),
    };

    Object.values(hands).forEach(hand => userDiv.appendChild(hand));

    // Create deck display section BELOW hands
    const deckContainer = document.createElement("div");
    deckContainer.id = "deckContainer";
    deckContainer.classList.add("deck-container");

    // Create Sort Button
    const sortingDiv = document.createElement("div");
    sortingDiv.classList.add("sorting-buttons");

    const sortButton = document.createElement("button");
    sortButton.innerText = "Sort";
    sortButton.onclick = sortDeck;

    sortingDiv.appendChild(sortButton);
    deckContainer.appendChild(sortingDiv);

    const deckDiv = document.createElement("div");
    deckDiv.id = "userDeck";
    deckDiv.classList.add("user-hand-line");
    deckContainer.appendChild(deckDiv);

    userDiv.appendChild(deckContainer);

    const confirmButton = document.createElement("button");
    confirmButton.id = "confirmArrangement";
    confirmButton.innerText = "DONE";
    confirmButton.style.display = "none";
    confirmButton.addEventListener("click", () => {
        finalizeUserArrangement();
        combineScore();
    });
    userDiv.appendChild(confirmButton);

    // Store user cards in deck
    userDeck = userCards.map(card => createCardElement(card));

    // Auto-sort deck by rank initially
    sortDeck();
}

// Function to reset all hands
function resetHands() {
    backHand = [];
    midHand = [];
    frontHand = [];
    userDeck = [];
}

// Function to create a hand section with dynamic label
function createHandSection(label, id) {
    const div = document.createElement("div");
    div.classList.add("hand-section");
    div.id = id;
    
    // Create heading with dynamic count span
    div.innerHTML = `<h4> <span id="${id}-count">${label}</span></h4>`;
    
    return div;
}

// Function to update hand labels dynamically with hand rank
function updateHandLabels() {
    let frontHandRank = findHandRankUser(frontHand);
    let midHandRank = findHandRankUser(midHand);
    let backHandRank = findHandRankUser(backHand);

    document.getElementById("frontHand-count").innerText = `${frontHandRank}`;
    document.getElementById("midHand-count").innerText = `${midHandRank}`;
    document.getElementById("backHand-count").innerText = `${backHandRank}`;
}

// Function to create interactive card elements
function createCardElement(card) {
    let img = document.createElement("img");
    img.src = card.image;
    img.alt = `${card.rank}${card.suit}`;
    img.classList.add("card", "clickable");

    // Store rank and suit as data attributes
    img.dataset.rank = card.rank;
    img.dataset.suit = card.suit;

    // When clicked, call moveCard
    img.onclick = () => moveCard(img);

    return img;
}

// Function to render the deck after sorting
function renderDeck() {
    const deckDiv = document.getElementById("userDeck");
    deckDiv.innerHTML = ""; // Clear current display
    userDeck.forEach(card => deckDiv.appendChild(card));
}

// Function to sort deck and toggle between rank & suit
function sortDeck() {
    const suitOrder = { S: 1, H: 2, C: 3, D: 4 }; // Spade > Heart > Club > Diamond

    userDeck.sort((a, b) => {
        let rankA = getCardValue(a.dataset.rank);
        let rankB = getCardValue(b.dataset.rank);
        let suitA = suitOrder[a.dataset.suit];
        let suitB = suitOrder[b.dataset.suit];

        if (sortMode === "suit") {
            return rankA - rankB || suitA - suitB; // Primary: Rank, Secondary: Suit
        } else { 
            return suitA - suitB || rankA - rankB; // Primary: Suit, Secondary: Rank
        }
    });

    renderDeck(); // Update deck display

    // Toggle sorting mode for next click
    sortMode = (sortMode === "suit") ? "rank" : "suit";
}

// Function to move a card between deck and hands
function moveCard(card) {
    const backDiv = document.getElementById("backHand");
    const midDiv = document.getElementById("midHand");
    const frontDiv = document.getElementById("frontHand");

    const cardRank = card.dataset.rank;  // Get rank from the dataset
    const cardSuit = card.dataset.suit;  // Get suit from the dataset

    // If the card is in the deck, move it to a hand
    if (userDeck.includes(card)) {
        userDeck.splice(userDeck.indexOf(card), 1); // Remove from deck
        if (backHand.length < 5) {
            backHand.push(card);
            backDiv.appendChild(card);
        } else if (midHand.length < 5) {
            midHand.push(card);
            midDiv.appendChild(card);
        } else if (frontHand.length < 3) {
            frontHand.push(card);
            frontDiv.appendChild(card);
        } else {
            // If all hands are full, return to deck
            userDeck.push(card);
        }
        renderDeck();
        updateHandLabels(); // Update hand labels dynamically
        updateConfirmButton();
        return;
    }

    // If the card is in a hand, move it back to the deck
    let found = false;
    [backHand, midHand, frontHand].forEach((handArray, index) => {
        if (handArray.includes(card)) {
            handArray.splice(handArray.indexOf(card), 1);
            document.getElementById(["backHand", "midHand", "frontHand"][index]).removeChild(card);
            userDeck.push(card);
            found = true;
        }
    });

    if (found) {
        renderDeck();
        updateHandLabels(); // Update hand labels dynamically
        updateConfirmButton();
    }
}

// Function to enable confirm button when all cards are placed
function updateConfirmButton() {
    const confirmButton = document.getElementById("confirmArrangement");
    confirmButton.style.display = (backHand.length + midHand.length + frontHand.length === 13) ? "block" : "none";
}

// Global object to store user hand in AI format
let userHand = {
    userID: "User",  // Added user ID
    backHand: [],
    midHand: [],
    frontHand: []
};

// Function to finalize user card arrangement
function finalizeUserArrangement() {
    userHand = {
        backHand: backHand.map(card => ({
            rank: card.dataset.rank,
            suit: card.dataset.suit,
            image: card.src,
            value: getCardValue(card.dataset.rank) // Ensure values match AI hand format
        })),
        midHand: midHand.map(card => ({
            rank: card.dataset.rank,
            suit: card.dataset.suit,
            image: card.src,
            value: getCardValue(card.dataset.rank)
        })),
        frontHand: frontHand.map(card => ({
            rank: card.dataset.rank,
            suit: card.dataset.suit,
            image: card.src,
            value: getCardValue(card.dataset.rank)
        }))
    };

    // Remove deck and sorting buttons
    const deckContainer = document.getElementById("deckContainer");
    if (deckContainer) deckContainer.remove();

    const confirmButton = document.getElementById("confirmArrangement");
    if (confirmButton) confirmButton.remove();
}

// Function to get numerical value for ranking (A = 14, K = 13, etc.)
function getCardValue(rank) {
    const rankValues = { A: 14, K: 13, Q: 12, J: 11, T: 10 };
    return rankValues[rank] || parseInt(rank);
}

function findHandRankUser(hand) {
    if (!hand || hand.length === 0) return "Empty Hand";

    let sortedHand = hand.slice().sort((a, b) => getCardValue(b.dataset.rank) - getCardValue(a.dataset.rank));
    let values = sortedHand.map(card => getCardValue(card.dataset.rank));
    let suits = sortedHand.map(card => card.dataset.suit);
    let uniqueValues = [...new Set(values)];
    let uniqueSuits = [...new Set(suits)];

    let isFlush = uniqueSuits.length === 1;
    let isStraight = uniqueValues.length === hand.length &&
                     (Math.max(...values) - Math.min(...values) === hand.length - 1);

    if (hand.length === 5) { // 5-card hands (Back & Mid)
        if (isFlush && isStraight && Math.max(...values) === 14) return "Royal Flush";
        if (isFlush && isStraight) return "Straight Flush";
        if (hasNOfAKind(values, 4)) return "Four of a Kind";
        if (hasFullHouse(values)) return "Full House";
        if (isFlush) return "Flush";
        if (isStraight) return "Straight";
        if (hasNOfAKind(values, 3)) return "Three of a Kind";
        if (hasTwoPairs(values)) return "Two Pair";
        if (hasNOfAKind(values, 2)) return "One Pair";
    } else if (hand.length === 3) { // 3-card hand (Front)
        if (hasNOfAKind(values, 3)) return "Three of a Kind";
        if (hasNOfAKind(values, 2)) return "One Pair";
    }

    return `High Card ${getCardRank(sortedHand[0])}`;
}


// Helper function to check N-of-a-Kind (2, 3, 4)
function hasNOfAKind(values, n) {
    return values.some(value => values.filter(v => v === value).length === n);
}

// Corrected Full House check
function hasFullHouse(values) {
    let counts = values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    return Object.values(counts).includes(3) && Object.values(counts).includes(2);
}

function hasTwoPairs(values) {
    const valueCounts = {};
    
    // Count the occurrences of each rank
    values.forEach(value => {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    // Filter for ranks that appear exactly twice
    const pairs = Object.values(valueCounts).filter(count => count === 2);

    return pairs.length === 2; // Two pairs if exactly two ranks appear twice
}


// Function to display the card rank properly
function getCardRank(card) {
       // Check if the card is an image element and if it has the required data attributes
    if (card && card instanceof HTMLImageElement && card.dataset.rank) {
        const rank = card.dataset.rank;
        const suit = card.dataset.suit;

        // Return the rank based on the value
        return rank === "A" ? "A" :
               rank === "K" ? "K" :
               rank === "Q" ? "Q" :
               rank === "J" ? "J" :
               rank === "T" ? "10" :
               rank;
    } else {
        return "Unknown"; // If card is not valid, return Unknown
    }
}


