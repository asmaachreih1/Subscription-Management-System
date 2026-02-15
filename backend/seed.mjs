import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, './.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription_db';

// Schema Definition
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    role: String,
    password: { type: String, default: 'password123' }
});

const PlanSchema = new mongoose.Schema({
    name: String,
    price: Number,
    duration: Number
});

const SubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' }
});

const User = mongoose.model('User', UserSchema);
const Plan = mongoose.model('Plan', PlanSchema);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🌱 Connecting to database for Lebanese context seeding...');

        // Clear existing data
        await User.deleteMany({ email: { $ne: 'admin@subflow.com' } });
        await Plan.deleteMany({});
        await Subscription.deleteMany({});

        // Seed Plans (Lebanese Providers: Alfa & touch)
        const plans = await Plan.insertMany([
            { name: 'Alfa 4G Plus (5GB)', price: 15, duration: 1 },
            { name: 'Alfa Unlimited Night', price: 25, duration: 1 },
            { name: 'touch 10GB Monthly', price: 19, duration: 1 },
            { name: 'touch Start Plan', price: 10, duration: 1 },
            { name: 'touch Enterprise Tier', price: 85, duration: 3 },
            { name: 'OGERO Fiber Home', price: 22, duration: 1 },
            { name: 'OGERO Pro Broadband', price: 45, duration: 1 }
        ]);
        console.log(`✅ Seeded ${plans.length} Lebanese service plans.`);

        // Seed Users (Arab Names)
        const userData = [
            { name: 'Ahmad Hassan', email: 'ahmad.h@lebanon.net', role: 'admin' },
            { name: 'Zeina Harb', email: 'zeina.harb@alfa.com.lb', role: 'user' },
            { name: 'Rami Khoury', email: 'rami@beirut.io', role: 'user' },
            { name: 'Nour Al-Deen', email: 'nour.ad@touch.com.lb', role: 'user' },
            { name: 'Hiba Salameh', email: 'hiba@sky.lb', role: 'user' },
            { name: 'Omar Al-Fayyad', email: 'omar.f@nexus.me', role: 'user' },
            { name: 'Layla Mansour', email: 'layla@cedar.lb', role: 'admin' },
            { name: 'Mostafa Ibrahim', email: 'mostafa@mtc.lb', role: 'user' },
            { name: 'Yasmine Berri', email: 'yasmine@horizon.lb', role: 'user' },
            { name: 'Tarek Joumblatt', email: 'tarek@mountain.lb', role: 'user' },
            { name: 'Hanan Ashrawi', email: 'hanan@diplomat.lb', role: 'user' },
            { name: 'Fadi Razzouk', email: 'fadi@techlebanon.com', role: 'user' },
            { name: 'Nadine Nassib', email: 'nadine@style.lb', role: 'user' },
            { name: 'Kamel El-Zahr', email: 'kamel@south.lb', role: 'user' },
            { name: 'Joanna Arida', email: 'joanna@cedars.lb', role: 'user' }
        ];
        const users = await User.insertMany(userData);
        console.log(`✅ Seeded ${users.length} Lebanese system nodes.`);

        // Seed Subscriptions
        const statuses = ['active', 'active', 'active', 'cancelled', 'expired'];
        const subscriptions = [];

        for (let i = 0; i < users.length; i++) {
            const randomPlan = plans[Math.floor(Math.random() * plans.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            const date = new Date();
            const monthOffset = Math.floor(Math.random() * 6) - 1;
            date.setMonth(date.getMonth() + monthOffset);

            subscriptions.push({
                user: users[i]._id,
                plan: randomPlan._id,
                status: randomStatus,
                endDate: date
            });
        }

        await Subscription.insertMany(subscriptions);
        console.log(`✅ Synchronized ${subscriptions.length} active allocations.`);

        console.log('✨ Lebanese context seeding complete. SubFlow is localized.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
