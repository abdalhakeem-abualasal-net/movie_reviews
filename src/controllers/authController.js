const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { createUser, matchPassword } = require('../models/user');
const crypto = require('crypto');

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
            return res.status(500).render('login', { message: 'حدث خطأ في الخادم' });
        }
        if (results.length === 0) {
            return res.status(400).render('login', { message: 'المستخدم غير موجود' });
        }

        const user = results[0];

        matchPassword(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).render('login', { message: 'حدث خطأ في الخادم' });
            }
            if (!isMatch) {
                return res.status(400).render('login', { message: 'بيانات تسجيل الدخول غير صحيحة' });
            }

            const sessionToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

            const insertSessionQuery = 'INSERT INTO sessions (user_id, session_token, created_at, expires_at) VALUES (?, ?, ?, ?)';
            db.query(insertSessionQuery, [user.id, sessionToken, new Date(), expiresAt], (err, result) => {
                if (err) {
                    return res.status(500).render('login', { message: 'حدث خطأ أثناء حفظ الجلسة' });
                }

                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                });

                res.cookie('session_token', sessionToken, {
                    httpOnly: true,
                    expires: expiresAt,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600000
                });

                res.redirect('/');
            });
        });
    });
};



const logoutUser = (req, res) => {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
        return res.redirect('/');
    }

    const deleteSessionQuery = "DELETE FROM sessions WHERE session_token = ?";
    db.query(deleteSessionQuery, [sessionToken], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الخروج' });
        }

        res.clearCookie('session_token');
        res.redirect('/');
    });
};


module.exports = { registerUser, loginUser, logoutUser };
