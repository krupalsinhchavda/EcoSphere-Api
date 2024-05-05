const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/GetAllComments', commentController.GetAllComments);
router.post('/CreateComment', commentController.CreateComment);

router.delete('/DeleteComment/:id', commentController.DeleteComment);
router.put('/UpdateComment/:id', commentController.UpdateComment);
router.get('/GetCommentByPostId/:id', commentController.GetCommentByPostId);

module.exports = router;