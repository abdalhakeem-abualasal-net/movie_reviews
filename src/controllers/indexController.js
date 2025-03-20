const db = require('../config/db');

exports.getIndexData = async (req, res) => {
    try {
        const query = `
            SELECT
                m.*,
                COUNT(DISTINCT c.id) AS comments_count,
                ROUND(AVG(r.rating), 1) AS rating,
                COUNT(DISTINCT r.id) AS reviews_count
            FROM
                movies m
            LEFT JOIN
                comments c ON m.id = c.movie_id
            LEFT JOIN
                ratings r ON m.id = r.movie_id
            GROUP BY
                m.id
            ORDER BY
                rating DESC;
        `;


        const [results] = await db.promise().query(query);

        res.render("index", { movies: results });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).send(`Error fetching data: ${err.message}`);
    }
};
