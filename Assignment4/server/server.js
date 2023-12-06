const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./api/users');
const lobbiesRouter = require('./api/lobby');
const charactersRouter = require('./api/character');
const medalsRouter = require('./api/medal');
const tradesRouter = require('./api/trade');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/lobby', lobbiesRouter);
app.use('/api/character', charactersRouter);
app.use('/api/medal', medalsRouter);
app.use('/api/trade', tradesRouter);

const port = process.env.PORT || 3000;

// Timeout after 10 seconds
app.use((req, res, next) => {
    res.setTimeout(10000, () => {
        res.status(408).json({ error: 'Request Timeout' });
    });
    next();
});

app.listen(port, () => console.log('Server is listening on port: ' + port));



