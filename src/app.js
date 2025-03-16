const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes"); // استيراد المسارات الخاصة بالتسجيل وتسجيل الدخول
const path = require('path');  // استيراد مكتبة path

const app = express();

// إعداد مكتبة body-parser للتعامل مع البيانات المرسلة عبر الـ form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // لإعداد استخدام الكوكيز

// إعداد EJS كـ view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// تحديد مجلد views بشكل صريح
app.set('views', path.join(__dirname, 'views'));  // تأكد أن هذا المسار يتوافق مع المكان الفعلي للملفات

// مسارات الصفحات
app.get("/", (req, res) => {
    res.render("index");  // عرض الصفحة الرئيسية
});

app.get("/review", (req, res) => {
    res.render("review");  // عرض الصفحة الرئيسية
});

app.get("/login", (req, res) => {
    res.render("login");  // عرض صفحة تسجيل الدخول
});

app.get("/register", (req, res) => {
    res.render("register");  // عرض صفحة إنشاء الحساب
});

// استخدام المسارات التي تم تعريفها في authRoutes
app.use("/auth", authRoutes);  // كل المسارات المرتبطة بـ /auth

// إعداد الخادم للاستماع على المنفذ
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
