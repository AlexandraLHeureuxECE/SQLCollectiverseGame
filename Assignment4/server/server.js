const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./api/users');
const lobbiesRouter = require('./api/lobby');
const charactersRouter = require('./api/character');
const medalsRouter = require('./api/medal');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/lobby', lobbiesRouter);
app.use('/api/character', charactersRouter);
app.use('/api/medal', medalsRouter);

app.listen(3000, () => console.log('Server is listening on port 3000...'));


