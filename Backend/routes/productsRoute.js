const express = require('express');
const router = express.Router();
const {createProduct} = require('../controllers/productsController');

router.post('/createProduct', createProduct);

module.exports = router;
