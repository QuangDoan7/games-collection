// Import the necessary modules for the server
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const express = require("express");
const app = express();
const cors = require("cors");

// Initialize the database variable, which will be assigned the database connection in the startup function
let db;

// Use CORS middleware to allow cross-origin requests and JSON middleware to parse incoming JSON requests
app.use(cors());
app.use(express.json());

// The GET request handler for retrieving a specific game by ID.
app.get("/api/:id", async function (req, res) {
    // Log the GET request for a specific game by ID to the console
    console.log("GET request for game with ID:", req.params.id);

    // Extract the ID parameter from the request URL
    const id = req.params.id;

    // Get the game data from the database using the ID
    const data = await db.get("SELECT rowid as id, * FROM GamesCollection WHERE rowid = ?", [id]);
    
    // if no game data is found for the provided ID, return a 404 error response
    if (!data) {
        res.json({ "error": "Game not found" });
        return;
    }

    // If game data is found, return the data as a JSON response
    res.json(data);
});

// The GET request handler for retrieving all games in the collection.
app.get("/api", async function (req, res) {
    // Log the GET request for all games in the collection to the console
    console.log("GET request for all games in the collection");

    // Get all game data from the database and return it as a JSON response
    const data = await db.all("SELECT rowid as id, * FROM GamesCollection");
    res.json(data);
});

// The POST request handler for inserting a new game into the collection.
app.post("/api", async function (req, res) {
    // Log the POST request for inserting a new game into the collection to the console
    console.log("POST request to insert a new game into the collection");

    // Extract the game information from the request body
    const { game, platform, releaseYear, genre, publisher } = req.body;

    // Insert the new game data into the database
    await db.run("INSERT INTO GamesCollection (game, platform, releaseYear, genre, publisher) VALUES (?, ?, ?, ?, ?)", [game, platform, releaseYear, genre, publisher]);

    // Return a success message as a JSON response
    res.json({ "status": "CREATE ENTRY SUCCESSFUL" });
});

// The DELETE request handler for deleting all games in the collection.
app.delete("/api", async function (req, res) {
    // Log the DELETE request for deleting all games in the collection to the console
    console.log("DELETE request for all games in the collection");

    // Delete all game data from the database and return a success message as a JSON response
    await db.run("DELETE FROM GamesCollection");
    res.json({ "status": "DELETE COLLECTION SUCCESSFUL" });
})

// The PUT request handler for updating all games in the collection.
app.put("/api", async function (req, res) {
    // Log the PUT request for updating all games in the collection to the console
    console.log("PUT request to replace all games in the collection");

    const newCollection = req.body; // Get the new collection of games from the request body

    // Start a transaction to ensure that the collection is updated atomically
    await db.run("DELETE FROM GamesCollection"); // Clear the existing collection

    // Loop through the new collection of games and insert each game into the database
    for (let game of newCollection) {
        // Insert each game from the new collection into the database
        await db.run("INSERT INTO GamesCollection (game, platform, releaseYear, genre, publisher) VALUES (?, ?, ?, ?, ?)", [game.game, game.platform, game.releaseYear, game.genre, game.publisher]);
    }

    res.json({ "status": "REPLACE COLLECTION SUCCESSFUL" }); // Return a success message as a JSON response
})

// The PUT request handler for updating a specific game by ID.
app.put("/api/:id", async function (req, res) {
    // Log the PUT request for updating a specific game by ID to the console
    console.log("PUT request to update game with ID:", req.params.id);

    // Extract the ID parameter from the request
    const id = req.params.id;

    // Extract the updated game information from the request body
    const { game, platform, releaseYear, genre, publisher } = req.body;

    // Update the game data in the database for the specified ID
    await db.run("UPDATE GamesCollection SET game = ?, platform = ?, releaseYear = ?, genre = ?, publisher = ? WHERE rowid = ?", [game, platform, releaseYear, genre, publisher, id]);

    // Return a success message as a JSON response
    res.json({ "status": "UPDATE ITEM SUCCESSFUL" });
})

// The DELETE request handler for deleting a specific game by ID.
app.delete("/api/:id", async function (req, res) {
    // Log the DELETE request for deleting a specific game by ID to the console
    console.log("DELETE request to delete game with ID:", req.params.id);
    
    // Extract the ID parameter from the request
    const id = req.params.id;

    // Delete the game data from the database for the specified ID and return a success message as a JSON response
    await db.run("DELETE FROM GamesCollection WHERE rowid = ?", [id]);
    res.json({ "status": "DELETE ITEM SUCCESSFUL" });
})

// The startup function initializes the database connection
async function startup() {
    // Open a connection to the SQLite database
    db = await sqlite.open({
        filename: "./database.db",
        driver: sqlite3.Database
    });

    // Create the GamesCollection table if it does not already exist
    await db.run("CREATE TABLE IF NOT EXISTS GamesCollection (game TEXT, platform TEXT, releaseYear NUMBER, genre TEXT, publisher TEXT)");

    // Check if there is existing data in the GamesCollection table, and if not, insert some initial game data into the table
    const existingData = await db.get("SELECT COUNT(*) as count FROM GamesCollection");
    
    if (existingData.count === 0) {
        // Use a prepared statement to insert multiple rows of game data into the GamesCollection table
        const stmt = await db.prepare("INSERT INTO GamesCollection VALUES (?, ?, ?, ?, ?)");
        
        await stmt.run("The Legend of Zelda: Breath of the Wild", "Nintendo Switch", 2017, "Action-adventure, Open-world", "Nintendo");
        await stmt.run("God of War (2018)", "PlayStation 4", 2018, "Action-adventure, RPG", "Sony Computer Entertainment");
        await stmt.run("Devil May Cry 5", "PlayStation 4, Xbox One, PC", 2019, "Action-adventure, Hack and slash", "Capcom");
        await stmt.run("Tekken 8", "PlayStation 5, Xbox Series X/S, PC", 2024, "Fighting", "Bandai Namco Entertainment");
        await stmt.run("Like a Dragon Gaiden: The Man Who Erased His Name", "PlayStation 4, PlayStation 5, Xbox Series X/S, PC", 2024, "Action RPG, Beat 'em up", "Sega");
        
        stmt.finalize(); // Finalize the prepared statement to free up resources
    }

    // Start the server and listen on port 3001. When the server is successfully started, it logs a message to the console.
    app.listen(3001, function() {
        console.log("REST API Available on Port 3001!");
    });
}

// Call the startup function
startup();