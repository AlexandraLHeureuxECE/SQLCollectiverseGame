const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/create', async (req, res) => {
    const { User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage } = req.body;

    try {
        const [results] = await db.execute(
            'INSERT INTO Trades (User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage, Status) VALUES (?, ?, ?, ?, ?, ?, ?, "pending")',
            [User1ID, User2ID, Char1ID, Char2ID, LobbyID, AdminID, TradeMessage]
        );

        res.json({ message: 'Trade request created successfully', tradeId: results.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/requests/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [trades] = await db.execute(
            'SELECT * FROM Trades WHERE User2ID = ? AND Status = "pending"',
            [userId]
        );

        res.json(trades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/accept/:tradeId', async (req, res) => {
    const { tradeId } = req.params;

    try {
        // Begin transaction
        await db.beginTransaction();

        // Validate trade request
        const [trade] = await db.execute('SELECT * FROM Trades WHERE TradeID = ? AND Status = "pending"', [tradeId]);
        if (trade.length === 0) {
            throw new Error('Trade request not found or already processed');
        }

        // Execute character exchange
        await db.execute('UPDATE characters SET UserID = ? WHERE CharID = ?', [trade[0].User2ID, trade[0].Char1ID]);
        await db.execute('UPDATE characters SET UserID = ? WHERE CharID = ?', [trade[0].User1ID, trade[0].Char2ID]);

        // Update trade request status
        await db.execute('UPDATE Trades SET Status = "accepted" WHERE TradeID = ?', [tradeId]);

        // Commit transaction
        await db.commit();

        res.json({ message: 'Trade accepted successfully' });
    } catch (err) {
        // Rollback transaction in case of error
        await db.rollback();

        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/reject/:tradeId', async (req, res) => {
    const { tradeId } = req.params;

    try {
        const [result] = await db.execute(
            'UPDATE Trades SET Status = "rejected" WHERE TradeID = ?',
            [tradeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Trade not found or already processed' });
        }

        res.json({ message: 'Trade rejected successfully' });
    } catch (err) {
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
