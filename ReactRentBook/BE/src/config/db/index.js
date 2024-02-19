const mongoose = require('mongoose');
async function connect() {
  try {
    await mongoose.connect(process.env.databaseURL || 'mongodb://localhost:27017/node_bookstore');
    console.log('mongoose connect succeeded');
  } catch (error) {
    console.log('mongoose connect failed');
  }
}

module.exports = { connect };
