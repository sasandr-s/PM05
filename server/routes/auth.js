const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send({ error: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ error: 'Invalid username or password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.send({ token, user: { id: user._id, username: user.username, role: user.role, fullName: user.fullName } });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/register', auth, admin, async (req, res) => {
    try {
        const { username, password, role, fullName, phone, email, measurements } = req.body;
        let user = await User.findOne({ username });
        if (user) return res.status(400).send({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            fullName,
            phone,
            measurements
        });
        await user.save();

        res.status(201).send({ message: 'User created successfully', user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
