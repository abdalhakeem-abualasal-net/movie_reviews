const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // تأكد من مسار قاعدة البيانات
const User = require('./user');  // تأكد من المسار الصحيح لنموذج المستخدم
const Movie = require('./movie');  // تأكد من المسار الصحيح لنموذج الفيلم

const Comment = sequelize.define('Comment', {
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {  // إضافة الحقل user_id
        type: DataTypes.INTEGER,
        allowNull: false
    },
    movie_id: {  // إضافة الحقل movie_id
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,  // استخدام DATE بدلاً من TIMESTAMP
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false,  // لا يستخدم Sequelize إدارة الجداول التلقائية للأوقات
});

// إضافة المفاتيح الخارجية (Foreign Keys)
Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(Movie, { foreignKey: 'movie_id', onDelete: 'CASCADE' });

module.exports = Comment;
