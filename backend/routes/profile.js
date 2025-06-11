const express = require('express');
const router = express.Router();

const Profile = require('../models/profileSchema');
const User = require('../models/userSchema');
const auth = require('../middleware/auth');
const Post = require('../models/postSchema');

// GET current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id }).populate('userId', 'name email');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE a new profile
router.post('/create', auth, async (req, res) => {
    const { name, bio, skill, socialLinks } = req.body;

    try {
        const existingProfile = await Profile.findOne({ userId: req.user._id });
        if (existingProfile) {
            return res.status(400).json({
                message: 'Profile already exists',
                profile: existingProfile
            });
        }

        const profile = new Profile({
            userId: req.user._id,
            name: name || req.user.name,
            bio,
            skill,
            socialLinks: {
                github: socialLinks?.github || '',
                linkedin: socialLinks?.linkedin || '',
                twitter: socialLinks?.twitter || ''
            }
        });

        const savedProfile = await profile.save();

        await User.findByIdAndUpdate(req.user._id, {
            $set: { profile: savedProfile._id }
        });

        res.status(201).json({
            message: 'Profile created successfully',
            profile: savedProfile
        });
    } catch (error) {
        console.error('Profile creation error:', error);
        res.status(500).json({ message: 'Error creating profile' });
    }
});

// UPDATE profile
router.put('/', auth, async (req, res) => {
    const { name, bio, skill, title, socialLinks } = req.body;

    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update fields
        profile.name = name || profile.name;
        profile.title = title || profile.title;
        profile.bio = bio || profile.bio;
        profile.skill = skill || profile.skill;
        profile.socialLinks = {
            ...profile.socialLinks,
            ...socialLinks
        };

        const updated = await profile.save();
        res.status(200).json(updated);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// DELETE profile (and optionally user)
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndDelete({ userId: req.user._id });

        await Post.deleteMany({ user: req.user._id }); 

        await Post.updateMany(
            {},
            { $pull: {comments: { user: req.user._id } } }
        );

        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'Profile and all posts deleted successfully' });
    } catch (error) {
        console.error('Profile delete error:', error);
        res.status(500).json({ message: 'Error deleting profile and posts' });
    }
});

module.exports = router;
