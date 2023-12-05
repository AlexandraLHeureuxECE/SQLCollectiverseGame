const express = require('express');
const router = express.Router();
const db = require('../database');

// Route signup for a user
router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, username, password, email } = req.body;
        const [results, fields] = await db.execute(
            'INSERT INTO user_account (first_name, last_name, username, password, email) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, username, password, email]
        );
        res.send(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route login for a user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [results, fields] = await db.execute(
            'SELECT * FROM user_account WHERE username = ? AND password = ?',
            [username, password]
        );
        res.send(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM user_account');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a user by id
router.get('/:id', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM User_Account WHERE UserID = ?', [req.params.id]);
        // Check if the user with the specified ID exists
        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.send(rows[0]); // Assuming you want to send the first user (if multiple users have the same ID)
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to update a user by id
router.put('/:id', async (req, res) => {
    try {
        const { first_name, last_name, username, password, email } = req.body;
        const [results, fields] = await db.execute(
            'UPDATE user_account SET first_name = ?, last_name = ?, username = ?, password = ?, email = ? WHERE UserID = ?',
            [first_name, last_name, username, password, email, req.params.id]
        );
        res.send(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete a user by id
router.delete('/:id', async (req, res) => {
    try {
        const [results, fields] = await db.execute('DELETE FROM user_account WHERE UserID = ?', [req.params.id]);
        res.send(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
module.exports = router;
