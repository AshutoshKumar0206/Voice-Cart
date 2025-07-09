const product = require('../model/product');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
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
    console.log("Request Files:", req.files);
    if (!req.files || !req.files.displayPicture) {
        return res.status(400).json({
            success: false,
            message: "No image file provided",
        });
    }
    let displayPicture = req.files.displayPicture;
    let image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER,
        1000,
        1000
    )
    console.log("Image URL:", image);
    let newProduct = await product.create({
        product_name: product_name,
        price: price,
        description: description,
        quantity: quantity,
        image: image.secure_url
    });
    console.log(newProduct);
    
    res.status(201).json({ 
        success: true, 
        message: "Product created successfully", 
        product: newProduct 
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
