const express = require('express');
const db = require('../database');
const router = express.Router();

// Route to create a new medal
router.post('/create', async (req, res) => {
    const { Medal_Name, Color, Cost, Medal_Icon } = req.body;

    try {
        const [results] = await db.execute(
            'INSERT INTO medals (MedalName, Color, Cost, Icon) VALUES (?, ?, ?, ?)',
            [Medal_Name, Color, Cost, Medal_Icon]
        );

        res.json({ message: 'Medal created successfully', medalId: results.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all medals
router.get('/', async (req, res) => {
    try {
        const [medals] = await db.execute('SELECT * FROM medals');

        res.json(medals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to grant a medal to a user within a lobby
router.post('/add-to-user', async (req, res) => {
    const { userId, medalId, lobbyId } = req.body;

    try {
        // Step 1: Check if the user exists
        const [user] = await db.execute('SELECT * FROM User_Account WHERE UserID = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Check if the medal exists
        const [medal] = await db.execute('SELECT * FROM Medals WHERE MedalID = ?', [medalId]);

        if (medal.length === 0) {
            return res.status(404).json({ error: 'Medal not found' });
        }

        // Step 3: Check if the lobby exists
        const [lobby] = await db.execute('SELECT * FROM Lobby WHERE LobbyID = ?', [lobbyId]);

        if (lobby.length === 0) {
            return res.status(404).json({ error: 'Lobby not found' });
        }

        // Step 4: Grant the medal to the user within the lobby
        await db.execute('INSERT INTO User_Lobby_Medals (UserID, MedalID, LobbyID) VALUES (?, ?, ?)', [userId, medalId, lobbyId]);

        res.json({ message: 'Medal granted to the user within the lobby successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all medals of a user within a lobby
router.get('/user/:userId/lobby/:lobbyId', async (req, res) => {
    const { userId, lobbyId } = req.params;

    try {
        // Step 1: Check if the user exists
        const [user] = await db.execute('SELECT * FROM User_Account WHERE UserID = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Get all medals of the user within the lobby
        const [medals] = await db.execute(
            'SELECT * FROM Medals WHERE MedalID IN (SELECT MedalID FROM User_Lobby_Medals WHERE UserID = ? AND LobbyID = ?)',
            [userId, lobbyId]
        );

        res.json(medals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a medal by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [medals] = await db.execute('SELECT * FROM medals WHERE MedalID = ?', [id]);

        // Check if the medal with the specified ID exists
        if (medals.length === 0) {
            return res.status(404).json({ error: 'Medal not found' });
        }

        res.json(medals[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;    