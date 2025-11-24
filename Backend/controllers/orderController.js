import Order from "../model/order.js";
import User from "../model/user.js";
import Product from "../model/product.js";
import Cart from "../model/cart.js";

/* ============================
        PLACE ORDER
============================ */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate total amount
    let totalAmount = 0;

    // Build order items with additional fields
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        rating: null,          // Rating not yet given
      });
    }

    // Create order with deliveredAt timestamp
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: totalAmount,
      status: "Delivered",
      deliveredAt: new Date(),  // store delivery timestamp
      reviewed: false,          // initially false
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Unable to place order",
    });
  }
};

/* ============================
        GET ORDERS BY USER
============================ */
export const getOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({ user: userId })
      .populate("items.product", "product_name price image category inStock tags")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      currentPage: page,
      ordersPerPage: limit,
      totalOrders: await Order.countDocuments({ user: userId }),
      totalPages: Math.ceil(await Order.countDocuments({ user: userId }) / limit),
      orders,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};