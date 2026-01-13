const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, required: true },
    status: {
        type: String,
        enum: ['Принят', 'В работе', 'Примерка', 'Готов к выдаче', 'Выдан'],
        default: 'Принят'
    },
    price: { type: Number, required: true },
    deadline: { type: Date },
    materials: { type: String },
    comments: { type: String },
    qualityNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
