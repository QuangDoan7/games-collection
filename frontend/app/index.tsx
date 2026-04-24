// StAuth10244: I, Thanh Quang Doan, 000955809 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

import { useState } from "react";
import { Image, Pressable, StyleSheet, ScrollView, Text, TextInput, View, useWindowDimensions} from "react-native";
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';

export default function Index() {
    // State for games data
    const [games, setGames] = useState<any[][]>([]);

    // State for input fields
    const [gameId, onChangeGameId] = useState("");
    const [gameName, onChangeGameName] = useState("");
    const [gamePlatform, onChangeGamePlatform] = useState("");
    const [gameReleaseYear, onChangeGameReleaseYear] = useState("");
    const [gameGenre, onChangeGameGenre] = useState("");
    const [gamePublisher, onChangeGamePublisher] = useState("");

    // State for tracking if game(s) are found
    const [foundGame, setFoundGame] = useState(true);

    // States for tracking editing mode
    const [editingGame, setEditingGame] = useState(false);
    const [editingGameId, setEditingGameId] = useState(-1);

    // Table configuration: header and column widths ratios
    const tableHead = ["ID", "Game", "Platform", "Release Year", "Genre", "Publisher", "", ""];
    const columnWidthsRatio = [0.07, 0.175, 0.175, 0.13, 0.175, 0.175, 0.05, 0.05];

    // Calculate column widths based on the current width of the screen
    let columnWidths = new Array(columnWidthsRatio.length).fill(0);
    for (let i = 0; i < columnWidths.length; i++) {
        columnWidths[i] = (useWindowDimensions().width - 40) * columnWidthsRatio[i];
    }

    // Function to retrieve a specific game by ID
    async function retrieveOneGame(gameId: number) {
        // Send a GET request to the backend API to retrieve the game with the specified ID
        const response = await fetch(`http://localhost:3001/api/${gameId}`);

        // Check if the response from the backend is successful
        if (!response.ok) {
            console.error("Failed to retrieve a game");
            return;
        }

        // If the response is successful, parse the JSON data
        const data = await response.json();

        // Check if the data contains an error message
        if (data.error) {
            // If so, log the error message
            console.error(data);

            // Clear the games state and set foundGame to false to indicate that no game was found
            setGames([]);
            setFoundGame(false);
            return; // Exit the function early since there is no game to display
        }

        // If the data is valid, create a tableData array with the game information
        const tableData = [[
            data.id,
            data.game,
            data.platform,
            data.releaseYear,
            data.genre,
            data.publisher,
            "",
            ""
        ]];

        // Set foundGame to true and update the games state with the retrieved game data
        setFoundGame(true);
        setGames(tableData);

        // Log the retrieved game data to the console
        console.log(data);
    }

    // Function to retrieve all games from the backend API
    async function retrieveAllGames() {
        // Send a GET request to the backend API to retrieve all games
        const response = await fetch("http://localhost:3001/api");

        // Check if the response from the backend is successful
        if (!response.ok) {
            console.error("Failed to retrieve games");
            setFoundGame(false);
            return;
        }

        // If the response is successful, parse the JSON data
        const data = await response.json();
        const tableData = data.map((game: any) => [
            game.id,
            game.game,
            game.platform,
            game.releaseYear,
            game.genre,
            game.publisher,
            "",
            ""
        ]);

        // Check if the retrieved data is empty
        if (tableData.length === 0) {
            // If so, log a message indicating that no games were found and update the state accordingly
            setFoundGame(false);
            console.log("No games found in the database");
            setGames([]);
            return;
        }

        // If there are games in the retrieved data, set foundGame to true and update the games state with the retrieved games data
        setFoundGame(true);
        setGames(tableData);

        // Log the retrieved games data to the console
        console.log("Retrieved games data successfully");
    }

    // Function to delete all games from the backend API
    async function deleteAllGames() {
        // Send a DELETE request to the backend API to delete all games
        const response = await fetch("http://localhost:3001/api", {
            method: "DELETE", // Specify the HTTP method as DELETE
            headers: { // Set the Content-Type header to indicate that the request body is in JSON format
                "Content-Type": "application/json"
            }
        });

        // Check if the response from the backend is successful
        if (!response.ok) {
            console.error("Failed to delete games");
            return;
        }

        // If the response is successful, call the retrieveAllGames function to refresh the list of games displayed in the frontend
        await retrieveAllGames();

        // Parse the JSON data from the response and log it to the console
        const data = await response.json();
        console.log(data);
    }

    // Function to add a new game to the backend API
    async function postNewGame() {
        // Send a POST request to the backend API to add a new game with the specified information
        const response = await fetch("http://localhost:3001/api", {
            method: "POST", // Specify the HTTP method as POST
            headers: { // Set the Content-Type header to indicate that the request body is in JSON format
                "Content-Type": "application/json"
            },
            // Include the game information in the request body as a JSON string
            body: JSON.stringify({
                game: gameName,
                platform: gamePlatform,
                releaseYear: parseInt(gameReleaseYear),
                genre: gameGenre,
                publisher: gamePublisher
            })
        });

        // Check if the response from the backend is successful
        if (!response.ok) {
            console.error("Failed to post new game");
            return;
        }

        // If the response is successful, call the retrieveAllGames function to refresh the list of games displayed in the frontend
        await retrieveAllGames();

        // Parse the JSON data from the response and log it to the console
        const data = await response.json();
        console.log(data);

        onChangeGameName("");
        onChangeGamePlatform("");
        onChangeGameReleaseYear("");
        onChangeGameGenre("");
        onChangeGamePublisher("");
    }

    // Variables to render edit and delete buttons in the table for each game
    const editing = (data: any, index: number) => (
        <Pressable onPress={() => editGame(index)}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image source={require("../assets/images/edit.png")} style={{ width: 20, height: 20 }} />
            </View>
        </Pressable>
    );

    const saveEditing = (gameId: number) => (
        <Pressable onPress={() => saveEditGame(games[gameId][0])}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image source={require("../assets/images/check.png")} style={{ width: 20, height: 20 }} />
            </View>
        </Pressable>
    );

    const deleting = (gameId: number) => (
        <Pressable onPress={() => deleteGame(games[gameId][0])}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image source={require("../assets/images/trash.png")} style={{ width: 20, height: 20 }} />
            </View>
        </Pressable>
    );
    
    // Function to handle the editing of a specific game, which populates the input fields with the current information of the game to be edited
    async function editGame(gameId: number) {
        setEditingGame(true);
        setEditingGameId(gameId);
        onChangeGameName(games[gameId][1]);
        onChangeGamePlatform(games[gameId][2]);
        onChangeGameReleaseYear(games[gameId][3].toString());
        onChangeGameGenre(games[gameId][4]);
        onChangeGamePublisher(games[gameId][5]);
    }

    // Function to save the edited information of a specific game
    async function saveEditGame(gameId: number) {
        // Send a PUT request to the backend API to update the game
        const response = await fetch(`http://localhost:3001/api/${gameId}`, {
            method: "PUT", // Specify the HTTP method as PUT
            headers: { // Set the Content-Type header to indicate that the request body is in JSON format
                "Content-Type": "application/json"
            },
            // Include the updated game information in the request body as a JSON string
            body: JSON.stringify({
                game: gameName,
                platform: gamePlatform,
                releaseYear: parseInt(gameReleaseYear),
                genre: gameGenre,
                publisher: gamePublisher
            })
        });

        // Check if the response from the backend is successful
        if (!response.ok) {
            console.error("Failed to edit the game");
            return;
        }

        // If the response is successful, call the retrieveAllGames function to refresh the list of games displayed in the frontend
        await retrieveAllGames();

        // Parse the JSON data from the response
        const data = await response.json();

        // Reset the states related to editing mode and clear the input fields
        setEditingGame(false);
        setEditingGameId(-1);
        onChangeGameName("");
        onChangeGamePlatform("");
        onChangeGameReleaseYear("");
        onChangeGameGenre("");
        onChangeGamePublisher("");

        // Log the response data to the console
        console.log(data);
    }

    // Function to delete a specific game by ID
    async function deleteGame(gameId : number) {
        // Send a DELETE request to the backend API to delete the game with the specified ID
        const response = await fetch(`http://localhost:3001/api/${gameId}`, {
            method: "DELETE", // Specify the HTTP method as DELETE
            headers: { // Set the Content-Type header to indicate that the request body is in JSON format
                "Content-Type": "application/json"
            }
        });

        // Check if the response from the backend is successful
        if (!response.ok) {
            console.error("Failed to delete the game");
            return;
        }

        // If the response is successful, call the retrieveAllGames function to refresh the list of games displayed in the frontend
        await retrieveAllGames();

        // Parse the JSON data from the response and log it to the console
        const data = await response.json();
        console.log(data);
    }

    return (
        // The main component of the app is a ScrollView to allow scrolling when the list of todos grows more than the screen height
        <ScrollView style={styles.body}>
            <View style={styles.headingContainer}>
                <Image
                    style={{ minWidth: useWindowDimensions().width * 0.4, maxHeight: useWindowDimensions().width * 0.2, resizeMode: "contain" }}
                    source={require("../assets/images/games_collection.png")}
                />
            </View>
            <View style={[
                styles.generalBody,
                {
                    flexDirection: useWindowDimensions().width > 700 ? "row" : "column",
                    justifyContent: useWindowDimensions().width > 700 ? "center" : "center",
                    gap: useWindowDimensions().width > 1000 ? 50 : 10
                }
            ]}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.generalText}>Retrieve game:</Text>
                    <TextInput
                        style={[styles.textInput, {width: 150}]}
                        keyboardType="numeric"
                        onChangeText={(text) => onChangeGameId(text.replace(/[^0-9]/g, ""))}
                        value={gameId}
                        placeholder="Game ID"
                        placeholderTextColor={"gray"}
                    />
                    <Pressable
                        style={[styles.button, {width: 100}]}
                        onPress={() => retrieveOneGame(parseInt(gameId))}
                    >
                        <Text style={styles.buttonText}>Get</Text>
                    </Pressable>
                </View>
                <Pressable
                        style={styles.button}
                        onPress={retrieveAllGames}       
                >
                    <Text style={styles.buttonText}>Retrieve All Games</Text>
                </Pressable>
                <Pressable 
                    style={styles.button}
                    onPress={deleteAllGames}
                >
                    <Text style={styles.buttonText}>Delete All Games</Text>
                </Pressable>
            </View>

            <View style={styles.generalBody}>
                <Text style={[styles.generalText, {color: "green", fontSize: 24, marginBottom: 10}]}>Insert a new game into the data!</Text>
                <View>
                    <View style={
                        { 
                            flexDirection: useWindowDimensions().width > 700 ? "row" : "column",
                            justifyContent: useWindowDimensions().width > 700 ? "center" : "center",
                        }
                    }>
                        <View style={{marginHorizontal: 10, marginBottom: 5}}>
                            <Text style={styles.generalText}>Name</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => onChangeGameName(text)}
                                value={gameName}
                                placeholder="Enter game name"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View style={{marginHorizontal: 10, marginBottom: 5}}>
                            <Text style={styles.generalText}>Platform</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => onChangeGamePlatform(text)}
                                value={gamePlatform}
                                placeholder="Enter game platform"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View style={{marginHorizontal: 10, marginBottom: 5}}>
                            <Text style={styles.generalText}>Release Year</Text>
                            <TextInput
                                style={styles.textInput}
                                keyboardType="numeric"
                                onChangeText={(text) => onChangeGameReleaseYear(text.replace(/[^0-9]/g, ""))}
                                value={gameReleaseYear}
                                placeholder="Enter release year"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={
                        { 
                            flexDirection: useWindowDimensions().width > 700 ? "row" : "column",
                            justifyContent: useWindowDimensions().width > 700 ? "center" : "center",
                        }
                    }>
                        <View style={{marginHorizontal: 10, marginBottom: 5}}>
                            <Text style={styles.generalText}>Genre</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => onChangeGameGenre(text)}
                                value={gameGenre}
                                placeholder="Enter genre"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View style={{marginHorizontal: 10, marginBottom: 5}}>
                            <Text style={styles.generalText}>Publisher</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => onChangeGamePublisher(text)}
                                value={gamePublisher}
                                placeholder="Enter publisher"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <Pressable
                            style={[
                                styles.button,
                                {
                                    marginVertical: 10,
                                    marginHorizontal: 15,
                                    alignSelf: "center"
                                }
                            ]}
                            onPress={postNewGame} disabled={editingGame ? true : false}
                        >
                            <Text
                                style={[styles.buttonText, {color: editingGame ? "gray" : "black"}]}
                            >
                                    Insert Game
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            
            { games.length > 0 &&
            <View style={styles.generalBody}>
                <Table borderStyle={{ borderWidth: 2, borderColor: "#e69941" }}>
                    <Row
                        widthArr={columnWidths}
                        textStyle={{ padding: 5, textAlign: "center", fontWeight: "bold", color: "green" }}  
                        data={tableHead}
                    />
                    {
                        games.map((rowData, index) => (
                            <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                                {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell
                                            textStyle={cellIndex === 0 ? { fontWeight: "bold", padding: 5, textAlign: "center" } : { padding: 5, textAlign: "center" }}
                                            width={columnWidths[cellIndex]}
                                            key={`${index}-${cellIndex}`}
                                            data={cellIndex === 6 ? (editingGame && editingGameId === index ? saveEditing(index) : editing(cellData, index)) : (cellIndex === 7 ? deleting(index) : cellData)}
                                        />
                                    ))
                                }
                            </TableWrapper>))
                    }
                </Table>
            </View>
            }

            { !foundGame &&
                <View>
                    <Text style={[styles.generalText, {color: "red"}]}>There is no game found!</Text>
                    <Image 
                        source={require('../assets/images/swing.gif')}
                        style={{ width: 200, height: 200, resizeMode: "contain", alignSelf: "center" }}
                    />
                </View> 
            }
        </ScrollView>

    );
}

// The styles for the application
const styles = StyleSheet.create({
    body: {
        backgroundColor: "#f3e7b0"
    },
    headingContainer: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 20
    },
    generalBody: {
        marginVertical: 10,
        marginHorizontal: 20
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    generalText: {
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        marginHorizontal: 5
    },
    textInput: { 
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#0143fa",
        borderRadius: 15,
        padding: 5,
        marginHorizontal: 5
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#aec3fc",
        borderWidth: 2,
        borderColor: "#0143fa",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginVertical: 5,
        marginHorizontal: 5
    },
    buttonText: {
        fontWeight: "bold",
        color: "black"
    }
});