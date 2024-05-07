const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.get('/GetAllOrders',ordersController.GetAllOrders);
router.get('/GetOrdersByUser/:id',ordersController.GetOrdersByUser);
router.get('/GetOrdersById/:id',ordersController.GetOrdersById);
router.post('/AddOrder',ordersController.AddOrder);
router.put('/UpdateOrder/:id',ordersController.UpdateOrder);
router.put('/UpdateOrderStatus/:id',ordersController.UpdateOrderStatus);
router.delete('/DeleteOrder/:id',ordersController.DeleteOrder);


module.exports = router