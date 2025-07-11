const express = require('express');
const router = express.Router();
const createMulterInstance = require('../utils/multer');
const productsController = require('../controllers/productsController');

const productUploader = createMulterInstance('uploads/products');

router.post('/createProduct', productUploader.single('image'), productsController.createProduct);
router.get('/getAllProducts', productsController.getAllProducts);
router.get('/getProductById/:id', productsController.getProductById);
router.get('/getTopDeals', productsController.getProductsByTopDeals);
router.get("/exploreProducts", productsController.exploreProducts);
router.get('/getProductsByCategory/:category', productsController.getProductsByCategory);

module.exports = router;
