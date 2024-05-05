const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const upload = require('../config/multerConfig');


router.get('/GetAllProducts', productsController.GetAllProducts);
router.get('/GetProductByid/:id', productsController.GetProductByid);
router.get('/GetProductByStoreId/:id', productsController.GetProductByStoreId);
router.delete('/DeleteProduct/:id', productsController.DeleteProduct);
router.put('/UpdateProduct/:id', productsController.UpdateProduct);
router.post('/CreateProduct', upload.single('image_url'), productsController.CreateProduct);

module.exports = router;