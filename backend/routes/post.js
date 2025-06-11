const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/postSchema');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// GET all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name _id')  // Fixed: removed 'username_id'
      .populate('likes', 'username')
      .populate('comments.user', 'name');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// POST create a new post (authenticated)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {    
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newPost = new Post({
      title,
      content,
      imageUrl,
      user: req.user._id // Ensure this comes from the verified token
    });

    console.log('Creating post with user ID:', newPost.user); // Debug log
    
    await newPost.save();
    await newPost.populate('user', 'name _id'); // Populate user info
    
    
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// POST like/unlike a post (authenticated)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.user) {
      post.user = req.user._id;
    }

    const userId = req.user._id;
    const likeIndex = post.likes.findIndex(
      _id => _id.toString() === userId.toString()
    );

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }
    console.log("saving post:", post);


    await post.save();

    // Populate necessary fields
    await post.populate([
      { path: 'user', select: 'name' },
      { path: 'likes', select: 'username' }
    ]);


    res.json(post);
  } catch (err) {
    console.error('Error in like route:', err);
    res.status(500).json({ message: 'Error updating like' });
  }
});

// POST add comment to a post (authenticated)
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { text } = req.body;

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (!post.user) {
      post.user = req.user._id;
    }
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    post.comments.push({
      text: text.trim(),
      user: req.user._id
    });

    await post.save();

    // Populate comment user info
    await post.populate('comments.user', 'name');
    res.json(post);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// PUT update a post (authenticated, owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content are required'
      });
    }

    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id // Only owner can update
      },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        message: 'Post not found or not authorized'
      });
    }

    await post.populate('user', 'name_id _id');
    res.json(post);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Error updating post' });
  }
});

// DELETE a post (authenticated, owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id // Only owner can delete
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found or not authorized'
      });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

module.exports = router;