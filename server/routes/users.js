const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

router.put('/:id/measurements', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).send({ error: 'Access denied' });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { measurements: req.body.measurements, phone: req.body.phone, fullName: req.body.fullName },
            { new: true }
        ).select('-password');
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

router.get('/', auth, admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.send({ message: 'User deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
