const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // تأكد من مسار قاعدة البيانات
const User = require('./user');  // تأكد من المسار الصحيح لنموذج المستخدم
const Movie = require('./movie');  // تأكد من المسار الصحيح لنموذج الفيلم

const Rating = sequelize.define('Rating', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    createdAt: {
        type: DataTypes.DATE,  // استخدام DATE بدلاً من TIMESTAMP
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false, // عدم استخدام الأوقات التلقائية
});

// إضافة المفاتيح الخارجية (Foreign Keys)
Rating.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Rating.belongsTo(Movie, { foreignKey: 'movie_id', onDelete: 'CASCADE' });

module.exports = Rating;
