const express = require('express');
const postsRouter = express.Router();

const {requireUser} = require('./utils');
const {getAllPosts} = require('../db');
const {createPost} = require('../db');
const {updatePost} = require('../db');
const {getPostById} = require('../db');

postsRouter.get('/', async (req, res, next) => {
    try {
        const allPosts = await getAllPosts();
  
        const posts = allPosts.filter(post => {
        // keep a post if it is either active, or if it belongs to the current user
            return post.active && (req.user && post.author.id === req.user.id);
        });
  
        res.send({
            posts
        });
    }   catch ({ name, message }) {
        next({ name, message });
    }
});

postsRouter.post('/', requireUser, async(req, res, next) => {
    // console.log(req)
    const {title, content, tags = ""} = req.body;
    
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    // only send the tags if there are some to send
    if (tagArr.length) {
        postData.tags = tagArr;
    }
    try {
        postData.title = title;
        postData.content = content;
        postData.authorId = req.user.id;
    
        const post = await createPost(postData)
    if (post) {
        res.send({
            message: "You created a post!",
            post
        });
    } else {
        next({
            name: "Post Creation Error",
            message: "Post not created"
        })
    }
    }   catch ({name, message}) {
        next ({ name, message })
    }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
});

module.exports = postsRouter;