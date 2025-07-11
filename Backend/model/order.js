const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    },
    quantity: {
        type:Number
    },
    discount:{
      type:Number,
      min: 5,
      max: 20
    }
  }],
  totalAmount: {
    type:Number,
  },
  status: {
    type: String,
    enum: ['Processing', 'Delivered'],
    default: 'Processing'
  }
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);