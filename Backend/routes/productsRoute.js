const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.post('/createProduct', productsController.createProduct);
router.get('/getAllProducts', productsController.getAllProducts);
router.get('/getProductById/:id', productsController.getProductById);

module.exports = router;
