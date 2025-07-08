const Cart = require('../model/cart');
const Product = require('../model/product');
const User = require('../model/user');
require('dotenv').config();

module.exports.addToCart = async (req, res) => {
    try {
        let user_id = req.user.id;
        console.log("User ID:", user_id);
        let productId = req.params.id;
        console.log("Product ID:", productId);
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User is not present"
            });
        }
        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID is required" 
            });
        }
            let product = await Product.findById(productId);
            if (!product) {
            return res.status(404).json({
                success: false, 
                message: "Product not found" });
            }

            const userCart = await User.findByIdAndUpdate(user_id, {
                                $addToSet: { cart: productId }
                                });

            let cart = await Cart.findOne({ user: user_id });

            if (!cart) {
            cart = new Cart({
                user: user_id,
                items: [{ product: productId }]
            });
            } else {
                 // Check if product already exists in cart
                const itemIndex = cart.items.findIndex(
                    item => item.product.toString() === productId
                );

                if (itemIndex >= 0) {
                    cart.items[itemIndex].quantity += 1;
                } else {
                    cart.items.push({ product: productId, quantity: 1 });
                }
            }

            const savedCart = await cart.save();
            res.status(200).json({
                success: true,
                message: "Product added to cart",
                cart: savedCart,
                userCart:userCart
            });

    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create cart"
        });
    }
}

module.exports.getCart = async (req, res) => {
    try {
        let user_id = req.params.id;
        let cart = await Cart.findOne({ user: user_id }).populate('items.product');
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch cart"
        });
    }
}

module.exports.updateCart = async (req, res) => {
    try {
        let user_id = req.user.id;
        let {productId, quantity } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User is not present"
            });
        }
        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID is required" 
            });
        }
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        let cart = await Cart.findOne({ user: user_id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
        console.log("Cart items:", cart.items);
        let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex < 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        cart.items[itemIndex].quantity = quantity;

        const updatedCart = await cart.save();
        
        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: updatedCart
        });

    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update cart"
        });
    }
}

module.exports.removeFromCart = async (req, res) => {
    try {
        console.log("User ID:", req.user);
        let user_id = req.user.id;
        let productId = req.body.productId;
        console.log(productId);
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User is not present"
            });
        }
        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID is required" 
            });
        }

        let cart = await Cart.findOne({ user: user_id });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        console.log("Cart items after removal:", cart.items);
        await User.findByIdAndUpdate(user_id, {
                            $pull: { cart: productId }
                        });
        let updatedCart = await cart.save();
        console.log("Updated Cart:", updatedCart);

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedCart
        });

    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({
            success: false,
            message: "Error when removing product from cart"
        });
    }
}