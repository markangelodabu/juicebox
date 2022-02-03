const express = require('express');
const server = express();
const morgan = require('morgan');
const { client } = require('./db');
const PORT = 3000;

server.use(morgan('dev'));

server.use(express.json());

server.use((req, res, next) => {
    console.log("<___Body Logger START___>");
    console.log(req.body);
    console.log("<___Body Logger END___>");

    next();
});

const apiRouter = require('./api');
server.use('/api', apiRouter);

server.listen(PORT, () => {
    client.connect();
    console.log('The server is up on port', PORT)
});