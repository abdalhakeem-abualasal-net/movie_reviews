const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { createUser, matchPassword } = require('../models/user');

const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        createUser(name, email, password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }

            const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(201).json({
                user: {
                    id: result.insertId,
                    name: name,
                    email: email,
                },
                token,
            });
        });
    });
};


const loginUser = (req, res) => {
    const { email, password } = req.body;

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const user = results[0];

        matchPassword(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });
            const exSession = req.session.userInfo = { userId: user.id}; 

            res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
                exSession,
            });
        });
    });
};

module.exports = { registerUser, loginUser };
