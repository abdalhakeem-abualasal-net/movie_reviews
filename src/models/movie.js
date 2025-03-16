const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // تأكد من مسار قاعدة البيانات

const Movie = sequelize.define('Movie', {
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    release_year: {
        type: DataTypes.INTEGER, // استخدم YEAR إذا كنت ترغب في استخدامها كنوع بيانات خاص
    },
    producer: {
        type: DataTypes.STRING(255),
    },
    genre: {
        type: DataTypes.STRING(100),
    },
    image_url: {
        type: DataTypes.STRING(255),
    },
}, {
    timestamps: true, // هذه الميزة تعني أنه سيتم إضافة الحقول createdAt و updatedAt تلقائيًا
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = Movie;
