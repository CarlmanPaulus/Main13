// function allPossibleCombinations() {
//     let allCombinations = {};

//     Object.keys(AIdf).forEach(player => {
//         let playerCards = AIdf[player]; // Get the player's full 13-card hand
//         allCombinations[player] = generateCombinations(playerCards, 5); // Get all 5-card combinations
//     });

//     return allCombinations; // Return all possible combinations for AI players
// }

// // Function to generate all unique 5-card combinations
// function generateCombinations(cards, comboSize) {
//     let result = [];

//     function combine(start, chosen) {
//         if (chosen.length === comboSize) {
//             result.push([...chosen]); // Store a valid 5-card combination
//             return;
//         }
//         for (let i = start; i < cards.length; i++) {
//             chosen.push(cards[i]); // Choose a card
//             combine(i + 1, chosen); // Recursively find next cards
//             chosen.pop(); // Backtrack
//         }
//     }

//     combine(0, []); // Start combination generation
//     return result; // Return all 5-card combinations
// }

