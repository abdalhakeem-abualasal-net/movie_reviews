const Rating = require('../models/rating');

// إنشاء تقييم جديد
exports.createRating = async (req, res) => {
    const { user_id, movie_id, rating } = req.body;

    try {
        const newRating = await Rating.create({
            user_id,
            movie_id,
            rating
        });
        res.status(201).json(newRating);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating rating" });
    }
};

// استرجاع التقييمات الخاصة بفيلم معين
exports.getRatingsByMovie = async (req, res) => {
    const { movie_id } = req.params;

    try {
        const ratings = await Rating.findAll({
            where: { movie_id },
            include: ['user']  // إذا كنت تريد تضمين بيانات المستخدم
        });
        res.status(200).json(ratings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving ratings" });
    }
};

// استرجاع التقييمات الخاصة بمستخدم معين
exports.getRatingsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const ratings = await Rating.findAll({
            where: { user_id },
            include: ['movie']  // إذا كنت تريد تضمين بيانات الفيلم
        });
        res.status(200).json(ratings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving ratings" });
    }
};
