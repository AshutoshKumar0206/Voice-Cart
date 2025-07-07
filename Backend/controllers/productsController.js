const product = require('../model/product');
require('dotenv').config();

module.exports.createProduct = async (req, res) => {
try{
    let {product_name, price, description, quantity} = req.body;
    if (!product_name || !price || !description || !quantity) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide all required fields" 
        });
    }
    let newProduct = new product(req.body);
    let savedProduct = await newProduct.save();
    console.log(savedProduct);
    
    res.status(201).json({ 
        success: true, 
        message: "Product created successfully", 
        product: savedProduct 
    });

} catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ 
        success: false, 
        message: "Unable to create product" 
    });
  }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        let products = await product.find();
        res.status(200).json({ 
            success: true, 
            products 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Unable to fetch products" 
        });
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        let productId  = req.params.id;
        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID is required" 
            });
        }
        let productData = await product.findById(productId);
        console.log("Product Data:", productData);
        if (!productData) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            productData: productData 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Unable to fetch product" 
        });
    }
}


