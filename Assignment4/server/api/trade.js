const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to create a new trade and perform the character exchange
router.post('/create', async (req, res) => {
    const { User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage } = req.body;

    try {
        // Disable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS=0');

        // Create the trade record
        const [results] = await db.execute(
            'INSERT INTO trades (User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage]
        );

        // Update the original records
        await db.execute(
            'UPDATE user_lobby_character SET UserID = ? WHERE UserID = ? AND CharID = ? AND LobbyID = ?',
            [User2ID, User1ID, Char1ID, LobbyID]
        );
        await db.execute(
            'UPDATE user_lobby_character SET UserID = ? WHERE UserID = ? AND CharID = ? AND LobbyID = ?',
            [User1ID, User2ID, Char2ID, LobbyID]
        );

        // Re-enable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS=1');

        res.json({ message: 'Trade created successfully', tradeId: results.insertId });
    } catch (err) {
        // Re-enable foreign key checks in case of any errors
        await db.query('SET FOREIGN_KEY_CHECKS=1');

        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all trades for a user
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [trades] = await db.execute(
            'SELECT * FROM trades WHERE User1ID = ? OR User2ID = ?',
            [id, id]
        );

        res.json(trades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all trades
router.get('/', async (req, res) => {
    try {
        const [trades] = await db.execute('SELECT * FROM trades');

        res.json(trades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a trade by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [trade] = await db.execute('SELECT * FROM trades WHERE TradeID = ?', [id]);

        // Check if the trade with the specified ID exists
        if (trade.length === 0) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        res.json(trade[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;