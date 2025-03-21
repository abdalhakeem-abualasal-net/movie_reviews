const db = require('../config/db');

const getAllFavorites = (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT
            m.*,
            COUNT(DISTINCT c.id) AS comments_count,
            ROUND(AVG(r.rating), 1) AS rating,
            COUNT(DISTINCT r.id) AS reviews_count,
            CASE 
                WHEN f.id IS NOT NULL THEN 1
                ELSE 0
            END AS is_favorites
        FROM
            movies m
        LEFT JOIN
            comments c ON m.id = c.movie_id
        LEFT JOIN
            ratings r ON m.id = r.movie_id
        LEFT JOIN
            favorites f ON m.id = f.movie_id AND f.user_id = 2
        WHERE
            f.user_id = 2  -- Add this condition to only return favorite movies for user with ID 2
        GROUP BY
            m.id
        ORDER BY
            rating DESC;

    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "An error occurred while fetching movie data" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "There is no movie in favourites" });
        }

        res.render("favorites" ,{ movies: results });
    });
};

const updateFavorite = (req, res) => {
    const { movieId } = req.body;
    const userId = req.session.userId;
    
    if (!userId || !movieId) {
        return res.status(400).json({ error: 'User ID and Movie ID are required.' });
    }

    const checkQuery = `SELECT 1 FROM favorites WHERE user_id = ? AND movie_id = ? LIMIT 1`;

    db.query(checkQuery, [userId, movieId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred.' });
        }

        if (result.length > 0) {
            // Movie exists -> Remove it from favorites
            const deleteQuery = `DELETE FROM favorites WHERE user_id = ? AND movie_id = ?`;
            db.query(deleteQuery, [userId, movieId], (deleteErr) => {
                if (deleteErr) {
                    console.error('Database error:', deleteErr);
                    return res.status(500).json({ error: 'Error occurred while deleting from favorites.' });
                }
                return res.status(200).json({ message: 'Movie successfully removed from favorites.' });
            });
        } else {
            // Movie not in favorites -> Add it
            const insertQuery = `INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)`;
            db.query(insertQuery, [userId, movieId], (insertErr) => {
                if (insertErr) {
                    console.error('Database error:', insertErr);
                    return res.status(500).json({ error: 'Error occurred while adding to favorites.' });
                }
                return res.status(200).json({ message: 'Movie successfully added to favorites.' });
            });
        }
    });
};

module.exports = {
    getAllFavorites,
    updateFavorite
};
