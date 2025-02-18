// Define deck with suits, values, and image filenames
const suits = ["S", "H", "C", "D"];  // Spades, Hearts, Diamonds, Clubs
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K","A"];
const deck = [];

// Create the deck
suits.forEach(suit => {
    ranks.forEach((rank, index) => {
        deck.push({
            rank: rank,
            suit: suit,
            value: index + 2, // A = 14, 2 = 2, ..., K = 13
            // image: `/cards/${rank}${suit}.svg`
            image: `https://raw.githubusercontent.com/CarlmanPaulus/Main13/master/cards/${rank}${suit}.svg`
        });
    });
});

// Create a mapping of card values
const cardValues = Object.fromEntries(deck.map(card => [card.rank + card.suit, card.value]));

// Function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
}

let AIdf = {}; // Stores AI hands before splitting
let AIhands = {}; // Stores AI hands after splitting
let userCards = []; // Stores player4's cards

function dealCards() {
    shuffleDeck(deck); // Shuffle the deck before dealing

    const players = {
        "player1": deck.slice(0, 13),
        "player2": deck.slice(13, 26),
        "player3": deck.slice(26, 39),
        "player4": deck.slice(39, 52),
    };

    // Update AI hands globally
    AIdf = {
        player1: players["player1"],
        player2: players["player2"],
        player3: players["player3"]
    };

    AIhands = {
        player1: splitHand(AIdf["player1"]),
        player2: splitHand(AIdf["player2"]),
        player3: splitHand(AIdf["player3"])
    };

    // Store Player 4's cards separately
    userCards = players["player4"];

    console.log("Cards have been dealt. Click 'Display AI Hands' to show them.");
}

// Function to split a player's 13 cards into Back, Mid, and Front hands
function splitHand(cards) {
    return {
        backHand: cards.slice(0, 5),
        midHand: cards.slice(5, 10),
        frontHand: cards.slice(10, 13),
    };
}



