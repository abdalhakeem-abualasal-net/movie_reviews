const db = require('../config/db');

const addRatingMovies = (req, res) => {
    const { user_id, movie_id , rating} = req.body;

    if (!user_id || !movie_id || rating === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 0 || rating > 10) {
        return res.status(400).json({ error: "Rating must be between 0 and 10" });
    }
    delete req.session.ratingInfo;
    const sessionQuery = `
        SELECT session_token, expires_at
        FROM sessions
        WHERE user_id = ?
        ORDER BY expires_at DESC
        LIMIT 1;
    `;

    db.query(sessionQuery, [user_id], (err, sessionResult) => {
        if (err) {
            console.error("Database error while checking session:", err);
            return res.status(500).json({ error: "An error occurred while checking the session" });
        }

        if (sessionResult.length === 0) {
            return res.status(401).json({ error: "User is not logged in" });
        }

        const { session_token, expires_at } = sessionResult[0];
        const sessionExpiresAt = new Date(expires_at);

        if (sessionExpiresAt < new Date()) {
            return res.status(401).json({ error: "Session expired" });
        }

        const checkQuery = `SELECT COUNT(*) AS count FROM ratings WHERE user_id = ? AND movie_id = ?;`;
        const insertQuery = `
            INSERT INTO ratings (user_id, movie_id, rating, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW());
        `;
        const updateQuery = `
            UPDATE ratings SET rating = ?, updated_at = NOW() 
            WHERE user_id = ? AND movie_id = ?;
        `;
        const countQuery = `
            SELECT COUNT(*) AS ratingCount FROM ratings WHERE movie_id = ?;
        `;

        db.query(checkQuery, [user_id, movie_id], (err, result) => {
            if (err) {
                console.error("Database error while checking rating:", err);
                return res.status(500).json({ error: "An error occurred while checking the rating" });
            }

            const count = result[0].count;

            if (count > 0) {
                db.query(updateQuery, [rating, user_id, movie_id], (err, updateResult) => {
                    if (err) {
                        console.error("Database error while updating rating:", err);
                        return res.status(500).json({ error: "An error occurred while updating the rating" });
                    }

                    const countQuery = `
                        SELECT COUNT(*) AS ratingCount, AVG(rating) AS avgRating FROM ratings WHERE movie_id = ?;
                    `;

                    db.query(countQuery, [movie_id], (err, countResult) => {
                        if (err) {
                            console.error("Error fetching updated rating count:", err);
                            return res.status(500).json({ error: "An error occurred while fetching the updated rating count" });
                        }

                        const updatedCount = countResult[0].ratingCount;
                        const avgRating = countResult[0].avgRating;

                        res.json({
                            message: "Rating added/updated successfully",
                            ratingCount: updatedCount,
                            avgRating: avgRating.toFixed(1)  
                        });
                    });
                });
            } else {
                db.query(insertQuery, [user_id, movie_id, rating], (err, insertResult) => {
                    if (err) {
                        console.error("Database error while adding rating:", err);
                        return res.status(500).json({ error: "An error occurred while adding the rating" });
                    }

                    const countQuery = `
                        SELECT COUNT(*) AS ratingCount, AVG(rating) AS avgRating FROM ratings WHERE movie_id = ?;
                    `;

                    db.query(countQuery, [movie_id], (err, countResult) => {
                        if (err) {
                            console.error("Error fetching updated rating count:", err);
                            return res.status(500).json({ error: "An error occurred while fetching the updated rating count" });
                        }

                        const updatedCount = countResult[0].ratingCount;
                        const avgRating = countResult[0].avgRating;

                        res.json({
                            message: "Rating added/updated successfully",
                            ratingCount: updatedCount,
                            avgRating: avgRating.toFixed(1) 
                        });
                    });
                });
            }

        });
    });
};

module.exports = { addRatingMovies };



