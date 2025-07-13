const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Cart = require('../model/cart');

module.exports.placeOrder = async (req, res) => {
    try {
        let userId = req.user.id;
        if(!userId){
            return res.status(400).json({ 
                success: false,
                message: 'User ID is required' 
            });
        }
        
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        let cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Cart is empty' 
            });
        }

        let totalAmount = 0;
        for (const item of cart.items) {
            let products = await Product.findById(item.product);
            if (!products) {
                return res.status(404).json({ 
                    success: false,
                    message: `Product with ID ${item.product} not found` 
                });
            }
            totalAmount += products.price * item.quantity;
        }
    
        const orders = await Order.create({
            user: userId,
            items:cart.items,
            orderAmount: totalAmount,
            status: "Delivered"
        });
    
        await orders.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: orders
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ 
            success: false,
            message: "Unable to place order", 
        });
    }
}

module.exports.getOrders = async (req, res) => {
    try {
        let userId = req.params.id;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        let skip = (page - 1) * limit;

        if(!userId){
            return res.status(400).json({ 
                success: false,
                message: 'User ID is required' 
            });
        }
        
        let orders = await Order.find({ user: userId })
                        .populate('items.product', 'product_name price image')
                        .skip(skip)
                        .limit(limit);

        if (!orders) {
            return res.status(404).json({ 
                success: false,
                message: 'No orders found for this user' 
            });
        }

        res.status(200).json({
            success: true,
            currentPage: page,
            totalOrders:orders.length,
            totalPages: Math.ceil(orders.length / limit),
            ordersPerPage: limit,
            orders : orders,
            message: "Orders fetched successfully"
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ 
            success: false,
            message: "Unable to fetch orders", 
        });
    }
}