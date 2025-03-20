const db = require('../config/db');


const addMovieComment = (req, res) => {
    const { movieId, userId, comment } = req.body;

    if (!movieId || !userId || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO comments (movie_id, user_id, comment, created_at)
        VALUES (?, ?, ?, NOW())
    `;

    db.query(query, [movieId, userId, comment], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "An error occurred while adding the comment" });
        }

        const fetchUserQuery = `
            SELECT users.name AS user_name FROM users WHERE users.id = ?
        `;

        db.query(fetchUserQuery, [userId], (err, userResults) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "An error occurred while fetching user data" });
            }

            const userName = userResults.length > 0 ? userResults[0].user_name : 'Unknown';

            res.status(201).json({
                message: 'Comment added successfully',
                comment: {
                    id: results.insertId,
                    movieId,
                    userId,
                    comment,
                    user_name: userName
                }
            });
        });
    });
};


const getCommentsByMovie = (req, res) => {
    const movieId = req.params.id;

    const query = `
        SELECT movies.*, ratings.rating, COUNT(ratings.id) AS rating_count
        FROM movies
        LEFT JOIN ratings ON movies.id = ratings.movie_id
        WHERE movies.id = ?
        GROUP BY movies.id
    `;

    db.query(query, [movieId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "An error occurred while fetching movie data" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }

        const formattedRating = results[0].rating ? results[0].rating.toFixed(1) : 'No rating available';
        const ratingCount = results[0].rating_count;

        res.render("review", { movie: results[0], rating: formattedRating, ratingCount: ratingCount });
    });
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

module.exports = {
    addMovieComment,
    getCommentsByMovie,
    deleteComment
};
