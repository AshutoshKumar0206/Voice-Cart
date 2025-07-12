const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type:String,
    required: true,
  },
  price: {
    type:Number,
    required: true
  },
  description:{ 
    type:String,
    required: true
  },
  category: {
    type:String,
  },
  image: {
    type:String,
  },
  quantity: {
    type: Number,
    default: 1
  },
  discount: {
    type: Number,
    min: 5,
    max: 20,
  }
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);