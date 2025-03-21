const router = express.Router();
const favoriteController = require('../controllers/favoriteController');


router.get('/favorites/:id', favoriteController.getAllFavorites);

module.exports = router;
