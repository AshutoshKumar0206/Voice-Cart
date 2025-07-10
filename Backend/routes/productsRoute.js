const express = require('express');
const router = express.Router();
const createMulterInstance = require('../utils/multer');
const productsController = require('../controllers/productsController');

const productUploader = createMulterInstance('uploads/products');

router.post('/createProduct', productUploader.single('image'), productsController.createProduct);
router.get('/getAllProducts', productsController.getAllProducts);
router.get('/getProductById/:id', productsController.getProductById);

module.exports = router;
