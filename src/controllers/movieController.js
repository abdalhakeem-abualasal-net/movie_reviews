const Movie = require('../models/movie'); // استيراد نموذج Movie

// إضافة فيلم جديد
const addMovie = async (req, res) => {
    try {
        const { title, description, release_year, producer, genre, image_url } = req.body;
        const newMovie = await Movie.create({
            title,
            description,
            release_year,
            producer,
            genre,
            image_url
        });
        res.status(201).json(newMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding movie', error });
    }
};

// الحصول على جميع الأفلام
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching movies', error });
    }
};

// الحصول على فيلم معين حسب ID
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching movie', error });
    }
};

// تحديث فيلم حسب ID
const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        const { title, description, release_year, producer, genre, image_url } = req.body;
        await movie.update({
            title,
            description,
            release_year,
            producer,
            genre,
            image_url
        });
        res.status(200).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating movie', error });
    }
};

// حذف فيلم حسب ID
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        await movie.destroy();
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting movie', error });
    }
};

module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie
};
