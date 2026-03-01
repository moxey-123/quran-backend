// tempAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

connectDB();

const createAdmin = async () => {
  try {
    const admin = new Admin({ username: 'luqman', password: 'luqman12' });
    await admin.save();
    console.log('Admin created ✅');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
