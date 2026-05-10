const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            role: String,
        }));
        
        const users = await User.find({}).limit(50);
        console.log('Users found:');
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}): ${u.role}`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listUsers();
