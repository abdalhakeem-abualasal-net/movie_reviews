const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// إضافة فيلم جديد
router.post('/movies', movieController.addMovie);

// الحصول على جميع الأفلام
router.get('/movies', movieController.getAllMovies);

// الحصول على فيلم معين حسب ID
router.get('/movies/:id', movieController.getMovieById);

// تحديث فيلم حسب ID
router.put('/movies/:id', movieController.updateMovie);

// حذف فيلم حسب ID
router.delete('/movies/:id', movieController.deleteMovie);

module.exports = router;
