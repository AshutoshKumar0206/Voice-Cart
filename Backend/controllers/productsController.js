const product = require('../model/product');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const cart = require('../model/cart');
const path = require('path');
const { cursorTo } = require('readline');
require('dotenv').config();

module.exports.createProduct = async (req, res) => {
try{
    let {product_name, price, description, quantity, category} = req.body;
    if (!product_name || !price || !description || !quantity || !category) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide all required fields" 
        });
    }
    console.log("reqest image file", req.file);
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image file provided",
        });
    }
    let displayPicture = req.file;
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
        category: category,
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
        let limit = parseInt(req.query.limit) || 5;
        let page = parseInt(req.query.page) || 1;
        let skip = (page - 1) * limit;

        let totalProducts = await product.countDocuments();
        let products = await product.find().skip(skip).limit(limit);
        res.status(200).json({ 
            success: true,
            currentPage: page,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit), 
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

module.exports.getProductsByTopDeals = async (req, res) => {
    try {
        const topDeals = await product.aggregate([
            { $sample: { size: 5 } }
        ]);
        if (!topDeals || topDeals.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No top deals found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            topDeals: topDeals 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Unable to fetch top deals" 
        });
    }
}

module.exports.exploreProducts = async (req, res) => {
    try {
        const exploredProducts = await product.aggregate([
            { $sample: { size: 8 } }
        ]);
        if (!exploredProducts || exploredProducts.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No products found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            exploredProducts: exploredProducts 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Unable to fetch required products" 
        });
    }
}

module.exports.getProductsByCategory = async (req, res) => {
    try{
       let category = req.params.category;
       let limit = parseInt(req.query.limit) || 5;
       let page = parseInt(req.query.page) || 1;
       let skip = (page - 1) * limit;
        if (!category) {
            return res.status(400).json({ 
                success: false, 
                message: "Category is required" 
            });
        }
        let totalProducts = await product.countDocuments({ category: category });
        let categoryProducts = await product.find({ category: category }).skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products: categoryProducts
        });
        
    } catch(error){
        res.status(500).json({ 
            success: false, 
            message: "Unable to fetch products by category" 
        });
    }
}
