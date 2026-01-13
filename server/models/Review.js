const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
