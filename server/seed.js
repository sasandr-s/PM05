const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        try {
            await User.collection.dropIndexes();
            console.log('Dropped existing indexes');
        } catch (e) {
            console.log('No indexes to drop or collection does not exist');
        }

        await User.deleteOne({ $or: [{ username: 'admin' }, { email: 'admin@atelier.com' }] });
        console.log('Removed existing admin if any');

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'admin',
            email: 'admin@atelier.com',
            password: hashedPassword,
            role: 'admin',
            fullName: 'Системный администратор',
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedAdmin();
