const db = require('../config/db');

const ratingsUser = (req, res) => {
    const rating = Math.floor(Math.random() * 0) + 5; 

    const selectRandomUserQuery = 'SELECT id FROM users ORDER BY RAND() LIMIT 1';
    const selectRandomMovieQuery = 'SELECT id FROM movies ORDER BY RAND() LIMIT 1';

    db.execute(selectRandomUserQuery, (err, userResults) => {
        if (err) return res.status(500).json({ message: 'Error fetching user', error: err });

        if (userResults.length === 0) {
            return res.status(404).json({ message: 'No users found in the database' });
        }

        const user_id = userResults[0].id;

        db.execute(selectRandomMovieQuery, (err, movieResults) => {
            if (err) return res.status(500).json({ message: 'Error fetching movie', error: err });

            if (movieResults.length === 0) {
                return res.status(404).json({ message: 'No movies found in the database' });
            }

            const movie_id = movieResults[0].id;

            const checkRatingQuery = 'SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?';
            db.execute(checkRatingQuery, [user_id, movie_id], (err, ratingResults) => {
                if (err) return res.status(500).json({ message: 'Error checking rating', error: err });

                if (ratingResults.length > 0) {
                    return res.status(400).json({ message: 'User has already rated this movie' });
                }

                const insertRatingQuery = 'INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)';
                db.execute(insertRatingQuery, [user_id, movie_id, rating], (err, result) => {
                    if (err) {
                        console.error('Error details:', err);
                        return res.status(500).json({ message: 'Error adding rating', error: err });
                    }

                    return res.status(201).json({
                        message: 'Rating added successfully',
                        rating: {
                            user_id,
                            movie_id,
                            rating
                        },
                    });
                });
            });
        });
    });
};

module.exports = { ratingsUser };
