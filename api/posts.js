const express = require('express');
const postsRouter = express.Router();

const {getAllPosts} = require('../db');

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        // "posts":[posts]
        posts
    });
});

module.exports = postsRouter;