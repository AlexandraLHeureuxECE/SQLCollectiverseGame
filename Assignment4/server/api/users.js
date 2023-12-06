const express = require('express');
const router = express.Router();
const db = require('../database');

// Route signup for a user
router.post('/signup', async (req, res) => {
    const { first_name, last_name, username, password, email } = req.body;

    try {
        const [results] = await db.execute(
            'INSERT IGNORE INTO user_account (first_name, last_name, username, password, email) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, username, password, email]
        );

        // Check if the affectedRows is 0 (duplicate entry error)
        if (results.affectedRows === 0) {
            return res.status(409).json({ error: 'Username or email already in use' });
        }

        res.json({ message: 'User created successfully', userId: results.insertId });
    } catch (err) {
        // Check if the error is a duplicate entry error (ER_DUP_ENTRY)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already in use' });
        }

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
        const [users] = await db.execute('SELECT * FROM user_account');

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a user by id
router.get('/:id', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM User_Account WHERE UserID = ?', [req.params.id]);

        // Check if the user with the specified ID exists
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]); // Assuming you want to send the first user (if multiple users have the same ID)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update a user by id
router.put('/:id', async (req, res) => {
    const { first_name, last_name, username, password, email } = req.body;
    const { id } = req.params;

    try {
        const [results] = await db.execute(
            'UPDATE user_account SET first_name = ?, last_name = ?, username = ?, password = ?, email = ? WHERE UserID = ?',
            [first_name, last_name, username, password, email, id]
        );

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete a user by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.execute('DELETE FROM user_account WHERE UserID = ?', [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
module.exports = router;
