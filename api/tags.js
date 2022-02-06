const express = require('express');
const tagsRouter = express.Router();

const {getAllTags} = require('../db');
const {getPostsByTagName} = require('../db');

tagsRouter.get('/', async (req, res, next) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const {tagName} = req.params;
    // read the tagname from the params
    try {
        const posts = await getPostsByTagName(tagName);
        res.send({posts});
      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
        next({name, message});
      // forward the name and message to the error handler
    }
  });

module.exports = tagsRouter;