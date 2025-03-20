const db = require('../config/db');

const addMovieComment = (req, res) => {
    const getRandomUserQuery = 'SELECT id FROM users ORDER BY RAND() LIMIT 1';
    const getRandomMovieQuery = 'SELECT id FROM movies ORDER BY RAND() LIMIT 1';

    db.query(getRandomUserQuery, (err, userResults) => {
        if (err) {
            console.error("Database Error (User):", err);
            return res.status(500).json({ error: "An error occurred while fetching random user" });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        const userId = userResults[0].id; 

        db.query(getRandomMovieQuery, (err, movieResults) => {
            if (err) {
                console.error("Database Error (Movie):", err);
                return res.status(500).json({ error: "An error occurred while fetching random movie" });
            }

            if (movieResults.length === 0) {
                return res.status(404).json({ error: "No movies found" });
            }

            const movieId = movieResults[0].id;
            const comment = req.body.comment; 

            if (!comment) {
                return res.status(400).json({ error: 'Comment field is required' });
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
        });
    });
};

module.exports = { addMovieComment };
