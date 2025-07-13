const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require("../middleware/auth.middleware");

router.post('/placeOrder/:id', isAuthenticated, orderController.placeOrder);
router.get('/getOrders/:id', isAuthenticated, orderController.getOrders);

module.exports = router;