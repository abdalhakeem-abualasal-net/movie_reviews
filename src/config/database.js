const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,  
});

sequelize.authenticate()
    .then(() => console.log("✅ Database connection successful"))
    .catch(err => console.error("❌ Error connecting to database:", err));

module.exports = sequelize;
