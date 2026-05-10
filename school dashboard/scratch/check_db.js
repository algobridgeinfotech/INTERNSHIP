
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String,
            password: { type: String, select: true }
        }));
        
        const user = await User.findOne({ email: 'teach7@gmail.com' });
        if (user) {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
            console.log('Password Hash:', user.password ? 'Exists' : 'None');
        } else {
            console.log('User not found');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUser();
