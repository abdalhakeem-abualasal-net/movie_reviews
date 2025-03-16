// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');  // تأكد من المسار الصحيح لنموذج المستخدم

const router = express.Router();

// صفحة التسجيل
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إنشاء مستخدم جديد
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في التسجيل');
    }
});

// صفحة تسجيل الدخول
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // البحث عن المستخدم باستخدام البريد الإلكتروني
        const user = await User.findOne({ where: { email } });

        // إذا لم يتم العثور على المستخدم
        if (!user) {
            return res.status(400).send('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // مقارنة كلمة المرور المدخلة مع كلمة المرور المشفرة
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // توليد توكن JWT للمصادقة
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // تخزين التوكن في الكوكيز
        res.cookie("token", token, { httpOnly: true });

        // إعادة التوجيه إلى الصفحة الرئيسية
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في تسجيل الدخول');
    }
});

module.exports = router;
