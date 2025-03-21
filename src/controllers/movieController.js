const db = require('../config/db');

const getMovieById = (req, res) => {
    const movieId = req.params.id;
    const sessionToken = req.cookies.session_token;
    const userId = req.user?.id || null; 

    const movieQuery = `
    SELECT * FROM movies WHERE id = ?`
        ;
    const ratingsQuery = `SELECT * FROM ratings WHERE movie_id = ?`;
    const commentsQuery = `
        SELECT comments.*, users.name AS user_name
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.movie_id = ?;
    `;
    const favoriteQuery = `
        SELECT COUNT(*) AS isFavorite
        FROM favorites
        WHERE user_id = ? AND movie_id = ?;
    `;

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
                : '0';
            
            const ratingCount = ratingsResults.length;

            db.query(commentsQuery, [movieId], (err, commentsResults) => {
                if (err) {
                    console.error("Error fetching comments:", err);
                    return res.status(500).send("Error fetching comments data");
                }

                const commentCount = commentsResults.length;

                if (userId) {
                    // استعلام المفضلة فقط إذا كان المستخدم مسجلاً
                    db.query(favoriteQuery, [userId, movieId], (err, favoriteResults) => {
                        if (err) {
                            console.error("Error fetching favorite status:", err);
                            return res.status(500).send("Error fetching favorite data");
                        }

                        const isFavorite = favoriteResults[0].isFavorite > 0; // إرجاع true أو false

                        res.render("review", {
                            movie,
                            ratings: ratingsResults,
                            comments: commentsResults,
                            formattedRating,
                            ratingCount,
                            commentCount,
                            isFavorite,
                            sessionToken
                        });
                    });
                } else {
                    // إذا لم يكن هناك مستخدم مسجل، نعيد isFavorite = false
                    res.render("review", {
                        movie,
                        ratings: ratingsResults,
                        comments: commentsResults,
                        formattedRating,
                        ratingCount,
                        commentCount,
                        isFavorite: false,
                        sessionToken
                    });
                }
            });
        });
    });
};

module.exports = { getMovieById };
