const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to create a new character
router.post('/create', async (req, res) => {
    const { Character_Name, Character_Value, Char_Icon, Nickname, Origin, AdminID } = req.body;

    try {
        const [results] = await db.execute(
            'INSERT INTO characters (Character_Name, Character_Value, Char_Icon, Nickname, Origin, AdminID) VALUES (?, ?, ?, ?, ?, ?)',
            [Character_Name, Character_Value, Char_Icon, Nickname, Origin, AdminID]
        );

        // Duplicate entry error
        if (results.affectedRows === 0) {
            return res.status(409).json({ error: 'Character already exists' });
        }

        res.json({ message: 'Character created successfully', characterId: results.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all characters
router.get('/', async (req, res) => {
    try {
        const [characters] = await db.execute('SELECT * FROM characters');

        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add specific characters array [1,2,3] into a lobby 
router.post('/add-into-lobby', async (req, res) => {
    const { lobbyId, characterIds } = req.body;

    try {
        // Step 1: Check if the lobby exists
        const [lobby] = await db.execute('SELECT * FROM lobby WHERE LobbyID = ?', [lobbyId]);

        if (lobby.length === 0) {
            return res.status(404).json({ error: 'Lobby not found' });
        }

        // Step 2: Check if the characters exist
        const placeholders = characterIds.map(() => '?').join(', ');
        const [characters] = await db.execute(`SELECT * FROM characters WHERE CharacterID IN (${placeholders})`, characterIds);

        if (characters.length !== characterIds.length) {
            return res.status(404).json({ error: 'One or more characters not found' });
        }

        // Step 3: Put characters into the lobby
        for (const characterId of characterIds) {
            await db.execute('INSERT INTO lobby_character (LobbyID, CharID) VALUES (?, ?)', [lobbyId, characterId]);
        }

        res.json({ message: 'Characters put into the lobby successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add all characters to a lobby
router.post('/add-all-into-lobby', async (req, res) => {
    const { lobbyId } = req.body;

    try {
        // Step 1: Check if the lobby exists
        const [lobby] = await db.execute('SELECT * FROM lobby WHERE LobbyID = ?', [lobbyId]);

        if (lobby.length === 0) {
            return res.status(404).json({ error: 'Lobby not found' });
        }

        // Step 2: Fetch all characters
        const [characters] = await db.execute('SELECT CharacterID FROM characters');

        if (characters.length === 0) {
            return res.status(404).json({ error: 'No characters found' });
        }

        // Step 3: Prepare the data for insertion
        const insertData = characters.map((character) => [lobbyId, character.CharacterID]);

        // Step 4: Insert all characters into the lobby
        const placeholders = insertData.map(() => '(?, ?)').join(', ');
        await db.execute(`INSERT INTO lobby_character (LobbyID, CharID) VALUES ${placeholders}`, [].concat(...insertData));

        res.json({ message: 'All characters added to the lobby successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a character to a user within a lobby
router.post('/add-to-user', async (req, res) => {
    const { userId, characterId, lobbyId } = req.body;

    try {
        // Step 1: Check if the user exists
        const [user] = await db.execute('SELECT * FROM user_account WHERE UserID = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Check if the character exists
        const [character] = await db.execute('SELECT * FROM characters WHERE CharacterID = ?', [characterId]);

        if (character.length === 0) {
            return res.status(404).json({ error: 'Character not found' });
        }

        // Step 3: Check if the lobby exists
        const [lobby] = await db.execute('SELECT * FROM lobby WHERE LobbyID = ?', [lobbyId]);

        if (lobby.length === 0) {
            return res.status(404).json({ error: 'Lobby not found' });
        }

        // Step 4: Add the character to the user within the lobby
        await db.execute('INSERT INTO user_lobby_character (UserID, CharID, LobbyID) VALUES (?, ?, ?)', [userId, characterId, lobbyId]);

        res.json({ message: 'Character added to the user within the lobby successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all characters in a lobby
router.get('/lobby/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Check if the lobby exists
        const [lobby] = await db.execute('SELECT * FROM lobby WHERE LobbyID = ?', [id]);

        if (lobby.length === 0) {
            return res.status(404).json({ error: 'Lobby not found' });
        }

        // Step 2: Get all characters in the lobby
        const [characters] = await db.execute(
            'SELECT * FROM characters WHERE CharacterID IN (SELECT CharID FROM lobby_character WHERE LobbyID = ?)',
            [id]
        );

        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all characters that a user has within a lobby
router.get('/user/:userId/lobby/:lobbyId', async (req, res) => {
    const { userId, lobbyId } = req.params;

    try {
        // Step 1: Check if the user exists
        const [user] = await db.execute('SELECT * FROM user_account WHERE UserID = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Get all characters that the user has within the lobby
        const [characters] = await db.execute(
            'SELECT * FROM characters WHERE CharacterID IN (SELECT CharID FROM user_lobby_character WHERE UserID = ? AND LobbyID = ?)',
            [userId, lobbyId]
        );

        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a character by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [characters] = await db.execute('SELECT * FROM characters WHERE CharacterID = ?', [id]);

        // Check if the character with the specified ID exists
        if (characters.length === 0) {
            return res.status(404).json({ error: 'Character not found' });
        }

        res.json(characters[0]); // Assuming you want to send the first character (if multiple characters have the same ID)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update a character by id
router.put('/:id', async (req, res) => {
    const { Character_Name, Character_Value, Char_Icon, Nickname, Origin, AdminID } = req.body;
    const { id } = req.params;

    try {
        const [results] = await db.execute(
            'UPDATE characters SET Character_Name = ?, Character_Value = ?, Char_Icon = ?, Nickname = ?, Origin = ?, AdminID = ? WHERE CharacterID = ?',
            [Character_Name, Character_Value, Char_Icon, Nickname, Origin, AdminID, id]
        );

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Character not found' });
        }

        res.json({ message: 'Character updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete a character by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the character exists
        const [characterResults] = await db.execute('SELECT * FROM characters WHERE CharacterID = ?', [id]);

        if (characterResults.length === 0) {
            return res.status(404).json({ error: 'Character not found' });
        }

        // Manually delete related records in lobby_character table
        await db.execute('DELETE FROM lobby_character WHERE CharID = ?', [id]);
         // Delete the character from user_lobby_character table
        await db.execute('DELETE FROM user_lobby_character WHERE CharID = ?', [id]);

        // Now, delete the character
        const [results] = await db.execute('DELETE FROM characters WHERE CharacterID = ?', [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Character not found' });
        }

        res.json({ message: 'Character deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;