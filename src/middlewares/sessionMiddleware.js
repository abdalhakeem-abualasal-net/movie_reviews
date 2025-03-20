const jwt = require('jsonwebtoken');
const db = require('../config/db');  // اتصال قاعدة البيانات

const sessionMiddleware = async (req, res, next) => {
    // الحصول على session_token من الكوكيز
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
        // إذا لم يكن هنالك session_token، يتم السماح بالمتابعة ولكن مع تعيين المستخدم إلى null
        res.locals.user = null;
        return next();
    }

    try {
        // التحقق من الجلسة في قاعدة البيانات
        const [sessionResults] = await db.promise().query(
            "SELECT * FROM sessions WHERE session_token = ? AND expires_at > NOW()",
            [sessionToken]
        );

        if (sessionResults.length === 0) {
            res.locals.user = null; // إذا كانت الجلسة غير موجودة أو انتهت
            return next();
        }

        const session = sessionResults[0];

        // استعلام للحصول على بيانات المستخدم بناءً على session_id
        const [userResults] = await db.promise().query(
            "SELECT id as  user_id FROM users WHERE id = ?",
            [session.user_id]
        );

        if (userResults.length === 0) {
            res.locals.user = null; // إذا لم يكن هناك مستخدم مرتبط بالجلسة
        } else {
            // تخزين بيانات المستخدم في locals لاستخدامها في الصفحات
            res.locals.user = userResults[0];
        }

        next();  // المتابعة إلى الصفحات التالية
    } catch (error) {
        console.error("Error fetching session or user:", error);
        res.locals.user = null; // في حال حدوث أي خطأ، لا يوجد مستخدم
        next();
    }
};

module.exports = sessionMiddleware;
