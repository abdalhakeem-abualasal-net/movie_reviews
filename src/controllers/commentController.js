const User = require('../models/user'); // استيراد نموذج User
const Comment = require('../models/comment'); // استيراد نموذج Comment
const Movie = require('../models/movie'); // استيراد نموذج Movie

// إضافة تعليق جديد
const addComment = async (req, res) => {
    try {
        const { user_id, movie_id, comment } = req.body;
        const newComment = await Comment.create({
            user_id,
            movie_id,
            comment
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

// الحصول على جميع تعليقات فيلم معين
const getCommentsByMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const comments = await Comment.findAll({
            where: { movie_id: movieId },
            include: [User], // تشمل بيانات المستخدم (اختياري)
        });
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

// حذف تعليق حسب ID
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
    addComment,
    getCommentsByMovie,
    deleteComment
};
