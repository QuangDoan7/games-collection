# Games Collection App

A full-stack application that allows users to manage a collection of video games, supporting full CRUD operations via a RESTful API.

This project includes:

- A RESTful API backend built with Express and SQLite
- A React Native application frontend

---

## Demo Video

Watch the application in action:
https://youtu.be/DCXEKAMeKm8

## Features

- View all games
- View a specific game by ID
- Add a new game
- Update existing game
- Delete a game

---

## Tech Stack

### Backend

- Node.js
- Express
- SQLite

### Frontend

- React Native (Expo)

---

## Architecture

React Native App → REST API → SQLite Database
The application communicates with the backend API to perform data operations, which are then persisted in a SQLite database.

---

## API Endpoints

| Method | Endpoint | Description               |
| ------ | -------- | ------------------------- |
| GET    | /api     | Get all games             |
| GET    | /api/:id | Get game by ID            |
| POST   | /api     | Create new game           |
| PUT    | /api     | Replace entire collection |
| PUT    | /api/:id | Update a game             |
| DELETE | /api/:id | Delete a game             |
| DELETE | /api     | Delete all games          |

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

---

## License

This project is licensed under the MIT License.

---

## What I Learned

- Designing and implementing RESTful APIs using Express
- Managing relational data using SQLite
- Integrating the application frontend with a backend API
- Structuring a full-stack application with clear separation of concerns
