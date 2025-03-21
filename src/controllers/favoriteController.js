const db = require('../config/db');


const getAllFavorites = (req, res) => {
    const query = `
        select * from favorites where user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "An error occurred while fetching movie data" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "There is no movie in favourites" });
        }

        res.json({ results: results[0]});
    });
};

module.exports = {
    getAllFavorites
};