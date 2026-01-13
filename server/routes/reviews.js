const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const review = new Review({
            client: req.user.id,
            text: req.body.text,
            rating: req.body.rating,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const total = await Review.countDocuments();
        const reviews = await Review.find()
            .populate('client', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.send({
            reviews,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalReviews: total
        });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

router.delete('/:id', auth, require('../middleware/auth').admin, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.send({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
