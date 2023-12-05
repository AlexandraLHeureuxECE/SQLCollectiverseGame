const express = require('express');
const router = express.Router();
const db = require('../database');
const { route } = require('./users');


// Route to create a new lobby
router.post('/create', async (req, res) => {
    try {
        const { title, type, code, adminId } = req.body;
        const [results, fields] = await db.execute(
            'INSERT INTO lobby (Lobby_Title, Lobby_Type, Lobby_Code, AdminID) VALUES (?, ?, ?, ?)',
            [title, type, code, adminId]
        );
        res.send(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all lobbies
router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM lobby');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a lobby by id
router.get('/:id', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM lobby WHERE LobbyID = ?', [req.params.id]);
        // Check if the lobby with the specified ID exists
        if (rows.length === 0) {
            res.status(404).json({ error: 'Lobby not found' });
        } else {
            res.send(rows[0]); // Assuming you want to send the first lobby (if multiple lobbies have the same ID)
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all lobbies that are public
router.get('/public', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM lobby WHERE Lobby_Type = "public"');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to allow users to join a lobby by code
router.post('/join', async (req, res) => {
    const { code, userId } = req.body;

    try {
        // Step 1: Validate that the Lobby_Code exists
        const [lobby] = await db.execute(
            'SELECT * FROM lobby WHERE Lobby_Code = ?',
            [code]
        );

        if (lobby.length === 0) {
            return res.status(404).json({ error: 'Lobby not found' });
        }

        const lobbyId = lobby[0].LobbyID;

        // Step 2: Insert a record into User_Lobby
        await db.execute(
            'INSERT INTO user_lobby (UserID, LobbyID) VALUES (?, ?)',
            [userId, lobbyId]
        );

        // Step 3: Update CurrentUsers in the Lobby table
        const [updateResults] = await db.execute(
            'UPDATE lobby SET CurrentUsers = CurrentUsers + 1 WHERE LobbyID = ?',
            [lobbyId]
        );

        res.json(updateResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to allow any user to join any public lobby
router.post('/join/public', async (req, res) => {
    const { lobbyId, userId } = req.body;

    try {
        // Step 1: Insert a record into User_Lobby
        await db.execute(
            'INSERT INTO user_lobby (UserID, LobbyID) VALUES (?, ?)',
            [userId, lobbyId]
        );

        // Step 2: Update CurrentUsers in the Lobby table
        const [updateResults] = await db.execute(
            'UPDATE lobby SET CurrentUsers = CurrentUsers + 1 WHERE LobbyID = ?',
            [lobbyId]
        );

        res.json(updateResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to allow users to leave a lobby
router.post('/leave', async (req, res) => {
    const { lobbyId, userId } = req.body;

    try {
        // Step 1: Delete a record from User_Lobby
        await db.execute(
            'DELETE FROM user_lobby WHERE UserID = ? AND LobbyID = ?',
            [userId, lobbyId]
        );

        // Step 2: Update CurrentUsers in the Lobby table
        const [updateResults] = await db.execute(
            'UPDATE lobby SET CurrentUsers = CurrentUsers - 1 WHERE LobbyID = ?',
            [lobbyId]
        );

        res.json(updateResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Route to get all users in a lobby
router.get('/:id/users', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM lobby_user WHERE LobbyID = ?', [req.params.id]);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); 

// Route to get all lobbies that a user is in
router.get('/user/:id', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM lobby_user WHERE UserID = ?', [req.params.id]);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
