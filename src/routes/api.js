const express = require('express');
const { registerUser, loginUser } = require('../services/apiAuth');
const { ratingsUser } = require('../services/apiRatings');
const { getMovieById } = require('../services/apiGetMovieById');
const { addMovieComment } = require('../services/apiComments');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getMovieById/:id', getMovieById);
router.post('/ratings', ratingsUser);

router.post('/addMovieComment', addMovieComment);

module.exports = router;
