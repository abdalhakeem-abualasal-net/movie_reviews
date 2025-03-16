const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/comments', commentController.addComment);

router.get('/comments/movie/:movieId', commentController.getCommentsByMovie);

router.delete('/comments/:id', commentController.deleteComment);

module.exports = router;
