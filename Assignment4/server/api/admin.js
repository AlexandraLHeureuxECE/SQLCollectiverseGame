const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to create a new admin
router.post('/create', async (req, res) => {
    const { username, password, email, admin_permission } = req.body; // Update variable names to match your table schema

    try {
        const [results] = await db.execute(
            'INSERT INTO admin_user (Username, Password, email, Admin_Permission) VALUES (?, ?, ?, ?)',
            [username, password, email, admin_permission]
        );

        // Check if the affectedRows is 0 (duplicate entry error)
        if (results.affectedRows === 0) {
            return res.status(409).json({ error: 'Username or email already in use' });
        }

        res.json({ message: 'Admin created successfully', adminId: results.insertId });
    } catch (err) {
        // Check if the error is a duplicate entry error (ER_DUP_ENTRY)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already in use' });
        }

        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to login for an admin
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [results] = await db.execute(
            'SELECT * FROM admin_user WHERE Username = ? AND Password = ?',
            [username, password]
        );

        // Check if the affectedRows is 0 (duplicate entry error)
        if (results.length === 0) {
            return res.status(409).json({ error: 'Username or password incorrect' });
        }

        res.send(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all admins
router.get('/', async (req, res) => {
    try {
        const [admins] = await db.execute('SELECT * FROM admin_user');

        res.json(admins);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get an admin by id
router.get('/:id', async (req, res) => {
    try {
        const [admins] = await db.execute('SELECT * FROM admin_user WHERE AdminID = ?', [req.params.id]);

        // Check if the admin with the specified ID exists
        if (admins.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json(admins[0]); // Assuming you want to send the first admin (if multiple admins have the same ID)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

