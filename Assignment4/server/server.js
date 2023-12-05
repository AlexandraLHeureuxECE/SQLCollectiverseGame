const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./api/users');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);

app.listen(3000, () => console.log('Server is listening on port 3000...'));


