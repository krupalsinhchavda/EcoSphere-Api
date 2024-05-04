const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/createPost', postController.createPost);
router.get('/getPost', postController.getPost);
router.get('/getPost/:id', postController.getPostById);
router.put('/updatePost/:id', postController.updatePost);
router.delete('/deletePost/:id', postController.deletePost);

module.exports = router;