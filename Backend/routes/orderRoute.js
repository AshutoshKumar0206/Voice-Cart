const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/placeOrder/:id', orderController.placeOrder);
router.get('/getOrders/:id', orderController.getOrders);

module.exports = router;