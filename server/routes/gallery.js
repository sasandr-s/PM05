const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');
const { auth, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'gallery-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const items = await GalleryItem.find().sort({ createdAt: -1 });
        res.send(items);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

router.post('/', auth, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'Image is required' });
        }

        const item = new GalleryItem({
            title: req.body.title,
            description: req.body.description,
            imageUrl: `/uploads/${req.file.filename}`
        });

        await item.save();
        res.status(201).send(item);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await GalleryItem.findByIdAndDelete(req.params.id);
        res.send({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
