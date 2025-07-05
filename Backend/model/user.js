const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order'
  }]
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);