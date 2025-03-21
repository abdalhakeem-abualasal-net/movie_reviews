const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/favorites/:id', favoriteController.getAllFavorites);
router.post('/favorites' , favoriteController.updateFavorite);
module.exports = router;
