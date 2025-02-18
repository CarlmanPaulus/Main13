document.getElementById("shuffleDealButton").addEventListener("click", function () {
    dealCards(); // Shuffle & deal cards
    updateAIhands();
    displayAIHands(AIhands);  // Display AI hands
    displayUserHand(userCards); // Display Player 4's hand
    
    console.log("Cards have been shuffled and dealt.");
});

// document.getElementById("displayAIButton").addEventListener("click", () => {
//     displayAIHands(AIhands);  // Display AI hands
//     displayUserHand(userCards); // Display Player 4's hand
// });

// document.getElementById("arrangeButton").addEventListener("click", updateAIhands);
