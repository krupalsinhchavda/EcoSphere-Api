const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// router.get('/Getfavorites', favoritesController.Getfavorites);
router.post('/Addfavorites', favoritesController.Addfavorites);
router.delete('/Deletefavorites/:id', favoritesController.Deletefavorites);
router.get('/GetfavoritesByProduct/:productId', favoritesController.GetfavoritesByProduct);
router.get('/GetfavoritesByUser/:userId', favoritesController.GetfavoritesByUser);

module.exports = router