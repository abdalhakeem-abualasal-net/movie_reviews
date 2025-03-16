const express = require('express');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

// مسار لإنشاء تقييم جديد
router.post('/', ratingController.createRating);

// مسار لاسترجاع التقييمات الخاصة بفيلم معين
router.get('/movie/:movie_id', ratingController.getRatingsByMovie);

// مسار لاسترجاع التقييمات الخاصة بمستخدم معين
router.get('/user/:user_id', ratingController.getRatingsByUser);

module.exports = router;
