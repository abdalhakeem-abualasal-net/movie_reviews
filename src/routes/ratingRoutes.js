const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/add_rating', ratingController.addRatingMovies);

module.exports = router;
