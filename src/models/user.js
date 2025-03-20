const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = (name, email, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err, null);
        }

        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [name, email, hashedPassword], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    });
};

const matchPassword = (inputPassword, hashedPassword, callback) => {
    bcrypt.compare(inputPassword, hashedPassword, (err, isMatch) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, isMatch);
    });
};

module.exports = { createUser, matchPassword };
