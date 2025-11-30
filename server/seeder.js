const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); 
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing users so we don't get duplicates
    await User.deleteMany(); 

    const users = [
      {
        name: 'Manager One',
        email: 'admin@test.com',
        password: 'password123',
        role: 'manager',
        employeeId: 'MGR001',
        department: 'HR',
      },
      {
        name: 'John Employee',
        email: 'john@test.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'IT',
      },
    ];

    await User.create(users);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();