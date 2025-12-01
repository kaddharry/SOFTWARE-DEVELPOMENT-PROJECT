import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config({ path: './.env' });

const migrateCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Product.updateMany(
            { category: { $exists: false } },
            { $set: { category: 'General' } }
        );

        console.log(`Migration complete. Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateCategories();
