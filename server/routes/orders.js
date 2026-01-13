const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, admin } = require('../middleware/auth');

router.post('/', auth, admin, async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.client = req.user.id;
        }
        const orders = await Order.find(query).populate('client', 'fullName username');
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

router.put('/:id', auth, admin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(order);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.send({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
