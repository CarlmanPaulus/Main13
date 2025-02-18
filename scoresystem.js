// Global storage for all players (AI + User)
let combinedStore = [];
let playerResults = {}; // Store player win/loss stats
let accumulateScore = []; // Accumulated scores
let roundNumber = 1; // Initialize the round number

// Function to combine AI hands with user hand (called before reshuffling)
function combineScore() {
    combinedStore = [];

    // Dynamically add AI players with their hands
    Object.keys(AIhands).forEach(aiPlayer => {
        combinedStore.push({ id: aiPlayer, ...AIhands[aiPlayer] });
    });

    // Add User's hand
    combinedStore.push({ id: "User", ...userHand });

    // Call H2H tables generation and ranking after combining hands
    generateH2HTables();
    rankPlayers(); // Rank players and display final rankings
}

// Function to generate H2H tables for Front, Mid, and Back hands
function generateH2HTables() {
    const container = document.getElementById("h2hTablesContainer");
    if (!container) {
        console.error("Container for H2H tables not found!");
        return;
    }

    container.innerHTML = `<h2>🏆 Head to Head - Round ${roundNumber}</h2>`; // Display round number in the header
    playerResults = {}; // Reset previous results

    // Loop through each hand type and create its respective H2H table
    ["frontHand", "midHand", "backHand"].forEach(handType => {
        const table = createH2HTable(handType);
        container.appendChild(table);
    });
}

// Function to create a single H2H table (with Net Score column)
function createH2HTable(handType) {
    const table = document.createElement("table");
    table.classList.add("h2h-table");

    // Create table header with an additional column for Net Score
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th")); // Empty top-left corner

    combinedStore.forEach(player => {
        const th = document.createElement("th");
        th.innerText = player.id;
        headerRow.appendChild(th);
    });

    // Adding the "Net Score" header to the right
    const netScoreHeader = document.createElement("th");
    netScoreHeader.innerText = "Net Score";
    headerRow.appendChild(netScoreHeader);

    table.appendChild(headerRow);

    // Create table body
    combinedStore.forEach(playerA => {
        const row = document.createElement("tr");

        // First column: player name
        const playerNameCell = document.createElement("th");
        playerNameCell.innerText = playerA.id;
        row.appendChild(playerNameCell);

        let totalWins = 0;
        let totalLosses = 0;

        // Fill in matchups and calculate wins/losses for net score calculation
        combinedStore.forEach(playerB => {
            const cell = document.createElement("td");

            if (playerA.id === playerB.id) {
                cell.innerText = "—"; // No comparison with self
                cell.style.backgroundColor = "#ddd";
            } else {
                let result = compareHands(playerA[handType], playerB[handType]);
                cell.innerText = result;

                // Store result for ranking
                storeMatchResult(playerA.id, playerB.id, result);

                // Calculate total wins/losses for the net score
                if (result.includes("✅")) {
                    totalWins += 1;
                } else if (result.includes("❌")) {
                    totalLosses += 1;
                }
            }

            row.appendChild(cell);
        });

        // Add the net score cell for the player
        const netScoreCell = document.createElement("td");
        const netScore = totalWins - totalLosses;
        netScoreCell.innerText = netScore;
        row.appendChild(netScoreCell);

        table.appendChild(row);
    });

    return table;
}

// Function to store match results for ranking (ONLY count wins/losses from the player's row)
function storeMatchResult(playerA, playerB, result) {
    if (!playerResults[playerA]) playerResults[playerA] = { wins: 0, losses: 0 };

    if (result.includes("✅")) {
        playerResults[playerA].wins += 1;
    } else if (result.includes("❌")) {
        playerResults[playerA].losses += 1;
    }
}

// Function to initialize or update accumulated scores
function updateAccumulateScore() {
    // If it's the first round (or after reshuffling), initialize accumulateScore with the player's results
    if (accumulateScore.length === 0) {
        accumulateScore = Object.keys(playerResults).map(player => ({
            player: player,
            wins: playerResults[player].wins,
            losses: playerResults[player].losses,
            score: playerResults[player].wins - playerResults[player].losses // Score = Wins - Losses
        }));
    } else {
        // If accumulateScore already has values, update it with new round results
        Object.keys(playerResults).forEach(player => {
            const playerInAccumulate = accumulateScore.find(p => p.player === player);

            if (playerInAccumulate) {
                // Update the wins/losses
                playerInAccumulate.wins += playerResults[player].wins;
                playerInAccumulate.losses += playerResults[player].losses;
                // Recalculate score
                playerInAccumulate.score = playerInAccumulate.wins - playerInAccumulate.losses;
            }
        });
    }

    // Log the accumulated score for debugging
    console.log("Accumulated score before sorting:", accumulateScore);

    // Sort players by wins, using score as a tiebreaker
    accumulateScore.sort((a, b) => b.wins - a.wins || b.score - a.score);

    // Log the accumulated score after sorting
    console.log("Accumulated score after sorting:", accumulateScore);
}

// Function to display final rankings in a table
function displayRankings(rankedPlayers) {
    const rankingContainer = document.getElementById("finalRankingContainer");
    if (!rankingContainer) {
        console.error("Ranking container not found!");
        return;
    }

    rankingContainer.innerHTML = `<h3>🏆 Rankings - Round ${roundNumber}</h3>`; // Display round number in ranking header

    let table = document.createElement("table");
    table.classList.add("ranking-table");

    let headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>Rank</th><th>Player</th><th>Wins</th><th>Losses</th><th>Score</th>";
    table.appendChild(headerRow);

    rankedPlayers.forEach((player, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${index + 1}</td><td>${player.player}</td><td>${player.wins}</td><td>${player.losses}</td><td>${player.score}</td>`;
        table.appendChild(row);
    });

    rankingContainer.appendChild(table);

    // Increment round number for the next round
    roundNumber += 1;
}

// Function to rank players based on total hand wins
function rankPlayers() {
    // If it's the first round (or after reshuffling), initialize accumulateScore with the player's results
    if (accumulateScore.length === 0) {
        accumulateScore = Object.keys(playerResults).map(player => ({
            player: player,
            wins: playerResults[player].wins,
            losses: playerResults[player].losses,
            score: playerResults[player].wins - playerResults[player].losses // Score = Wins - Losses
        }));
    } else {
        // If accumulateScore already has values, update it with new round results
        Object.keys(playerResults).forEach(player => {
            const playerInAccumulate = accumulateScore.find(p => p.player === player);

            if (playerInAccumulate) {
                // Update the wins/losses
                playerInAccumulate.wins += playerResults[player].wins;
                playerInAccumulate.losses += playerResults[player].losses;
                // Recalculate score
                playerInAccumulate.score = playerInAccumulate.wins - playerInAccumulate.losses;
            }
        });
    }

    // Log the accumulated score before sorting
    console.log("Accumulated score before sorting:", accumulateScore);

    // Sort players by wins, using score as a tiebreaker
    accumulateScore.sort((a, b) => b.wins - a.wins || b.score - a.score);

    // Log the accumulated score after sorting
    console.log("Accumulated score after sorting:", accumulateScore);

    // Display ranking for this round
    displayRankings(accumulateScore);
}

