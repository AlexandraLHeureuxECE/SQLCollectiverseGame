const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to create a new trade
router.post('/create', async (req, res) => {
    const { User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage } = req.body;

    try {
        const [results] = await db.execute(
            'INSERT INTO trades (User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage]
        );

        res.json({ message: 'Trade created successfully', tradeId: results.insertId });
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
