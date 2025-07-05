const product = require('../model/product');
require('dotenv').config();

module.exports.createProduct = async (req, res) => {
try{
    const { name, price, description, image, inStock } = req.body;
    if (!name || !price || !description || !image) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide all required fields" 
        });
    }

    const product = new product(req.body);
    const savedProduct = await product.save();
    
    res.status(201).json({ 
        success: true, 
        message: "Product created successfully", 
        product: savedProduct 
    });

} catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Unable to create product" 
    });
  }
}

