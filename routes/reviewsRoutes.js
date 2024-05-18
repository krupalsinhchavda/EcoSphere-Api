const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.get('/GetReviewsByProduct/:productId', reviewsController.GetReviewsByProduct);
router.get('/GetReviewsByUser/:userId', reviewsController.GetReviewsByUser);
router.get('/GetReviewsById/:id', reviewsController.GetReviewsById);
router.post('/AddReviews', reviewsController.Addreviews);
// router.put('/UpdateReviews', reviewsController.UpdateReviews);
// router.delete('DeleteReviews/:id', reviewsController.DeleteReviews);

module.exports = router;