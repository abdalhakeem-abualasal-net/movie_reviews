const db = require('../config/db');

const getMovieById = (req, res) => {
    const movieId = req.params.id;

    const movieQuery = `SELECT * FROM movies WHERE id = ?`;
    const ratingsQuery = `SELECT * FROM ratings WHERE movie_id = ?`;
    const commentsQuery = `SELECT * FROM comments WHERE movie_id = ?`;

    db.query(movieQuery, [movieId], (err, movieResults) => {
        if (err) {
            console.error("Error fetching movie:", err);
            return res.status(500).send("Error fetching movie data");
        }

        if (movieResults.length === 0) {
            return res.status(404).send("Movie not found");
        }

        const movie = movieResults[0];

        db.query(ratingsQuery, [movieId], (err, ratingsResults) => {
            if (err) {
                console.error("Error fetching ratings:", err);
                return res.status(500).send("Error fetching ratings data");
            }

            const formattedRating = ratingsResults.length > 0 ?
                (ratingsResults.reduce((sum, rating) => sum + rating.rating, 0) / ratingsResults.length).toFixed(1)
                : 'No ratings available';

            const ratingCount = ratingsResults.length;

            db.query(commentsQuery, [movieId], (err, commentsResults) => {
                if (err) {
                    console.error("Error fetching comments:", err);
                    return res.status(500).send("Error fetching comments data");
                }

                const commentCount = commentsResults.length;

                res.json({
                    movie,
                    ratings: ratingsResults,
                    comments: commentsResults,
                    formattedRating,
                    ratingCount,
                    commentCount
                });
            });
        });
    });
};

module.exports = { getMovieById };
