const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Profile = require('../models/profileSchema'); // Assuming you have a Profile model
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password ,role} = req.body;

    let requestedRole = 'user';
    if (role === 'admin') {
        if (req.body.adminSecret === process.env.ADMIN_SECRET) {
            requestedRole = 'admin';
        }
    }
    try {
        const salt = await bcrypt.genSalt(10);
        // console.log('salt', salt);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: requestedRole,
        })
        const savedUser = await user.save()
        console.log('savedUser', savedUser);

        //  const profile = new Profile({
        //     userId: savedUser._id,
        //     name: savedUser.name
        // });
        // await profile.save();

        //  Update user with profile reference
        // await User.findByIdAndUpdate(savedUser._id, { profile: profile._id });


        // res.send(`User ${savedUser.name} registered successfully`);
        const token = jwt.sign({ _id: savedUser._id, name: savedUser.name, email: savedUser.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'User registered successfully', user: savedUser, token });

    } catch (error) {
        console.error(error);

    }
})

router.post('/login', async (req, res) => {
    const { email, password, isAdmin } = req.body;  // <-- add isAdmin flag

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If trying to login as admin but user is not admin
        if (isAdmin && user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Not an admin' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Add role in JWT payload
        const token = jwt.sign(
            { _id: user._id, name: user.name, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        return res.status(200).json({ message: 'Login successful', user, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



router.get('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
})
module.exports = router;