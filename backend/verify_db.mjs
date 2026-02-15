import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription-system';

async function verifyDB() {
    try {
        console.log(`🔍 Connecting to MongoDB at: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`\nFound ${collections.length} collections:`);

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count} documents`);

            if (count > 0) {
                const sample = await mongoose.connection.db.collection(col.name).findOne();
                console.log(`   Sample ID: ${sample?._id}`);
            }
        }

        await mongoose.disconnect();
        console.log('\n✅ Database verification complete.');
    } catch (err) {
        console.error('❌ Database verification failed:', err);
    }
}

verifyDB();
