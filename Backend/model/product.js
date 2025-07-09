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
  discount: {
    type:Number,
    default: 0,
    min: 0,
    max: 100
  },
  quantity: {
    type: Number,
    default: 1
  },
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);