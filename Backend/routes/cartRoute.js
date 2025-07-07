const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth.middleware');

router.post('/addToCart/:id', isAuthenticated, cartController.addToCart);
router.get('/getCart/:id', isAuthenticated, cartController.getCart);
router.put('/updateCart/:id', isAuthenticated, cartController.updateCart);
router.delete('/removeFromCart', isAuthenticated, cartController.removeFromCart);

module.exports = router;