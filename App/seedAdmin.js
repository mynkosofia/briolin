const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

// Заміни на свої дані
const adminLogin = 'admin';
const adminEmail = 'mynkosofi@gmail.com';
const adminPassword = 'admin24021998'; // Задай складний пароль!

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/blog',
    {useNewUrlParser: true,
  useUnifiedTopology: true}
  ); // заміни на свою назву БД

  const admin = await User.findOne({ login: adminLogin });
  if (admin) {
    console.log('Admin already exists');
    mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(adminPassword, 10);
  await User.create({
    login: adminLogin,
    email: adminEmail,
    password: hash,
    role: 'admin'
  });

  console.log('Admin created!');
  mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error(err);
  mongoose.disconnect();
});