function updateAIhands() {
    if (!AIdf || Object.keys(AIdf).length === 0) {
        console.log("No cards to arrange. Deal first!");
        return;
    }

    // Process AIdf into AIhands
    AIhands = strongestHand(AIdf);

    console.log("AI hands arranged successfully:", AIhands);
}