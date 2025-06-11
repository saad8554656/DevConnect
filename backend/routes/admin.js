const express = require('express');
const User = require('../models/userSchema');
const Post = require('../models/postSchema');
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts (admin only)
router.get('/posts', auth, adminAuth , async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name email');
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post by id (admin only)
router.delete('/posts/:id', auth ,adminAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users by name or email (admin only)
router.get('/users', auth ,adminAuth, async (req, res) => {
  const { search } = req.query;
  try {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a user by id (admin only)
router.get('/users/:id', auth ,adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});
//edit roles
router.put('/users/:id/role', auth ,adminAuth, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating role' });
  }
});

// Delete a user by id (admin only)
router.delete('/users/:id',auth ,adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Post.deleteMany({ user: req.params.id });
    res.json({ message: 'User and their posts deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }


});

router.get('/users/:id/posts', auth ,adminAuth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id }).populate('user', 'name email',{
    }).populate('user', 'name email');
    if (!posts) return res.status(404).json({ message: 'No posts found for this user' }); 
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
    
  }
})

module.exports = router;
