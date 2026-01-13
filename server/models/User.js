const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    fullName: { type: String, required: true },
    phone: { type: String },
    measurements: {
        height: Number,
        chest: Number,
        waist: Number,
        hips: Number,
        additionalParams: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
