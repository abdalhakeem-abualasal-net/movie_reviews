require('dotenv').config();
const session = require("express-session");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes"); 
const movieRoutes = require("./routes/movieRoutes");
const commentRoutes = require("./routes/commentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes")
const api = require('./routes/api');
const path = require('path');  
const sessionMiddleware = require('../src/middlewares/sessionMiddleware');
const indexController = require("../src/controllers/indexController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(sessionMiddleware);

app.use(session({
    secret: "jL@9!f#4s5%T6&bN$wQmXz",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 30 
    }
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views')); 

app.get("/", indexController.getIndexData);

app.get("/review", (req, res) => {
    res.render("review");  
});

app.get("/login", (req, res) => {
    res.render("login");  
});



app.get("/register", (req, res) => {
    res.render("register");  
});

app.get("/favorites", (req, res) => {
    res.render("favorites");
});



app.post("/save-rating", (req, res) => {
    const { movieId, rating } = req.body;
    if (!movieId || !rating) {
        return res.status(400).json({ message: "Missing movieId or rating" });
    }

    req.session.ratingInfo = { movieId: movieId , rating: rating };

    console.log("Session Data After Saving Rating:", req.session);

    res.status(200).json({
        message: "Rating saved in session",
        movieId: movieId,
        rating: rating
    });
});


app.get("/get-pending-rating", (req, res) => {
    if (req.session.ratingInfo) {
        const ratingInfo = req.session.ratingInfo;
        console.log("Returning Pending Rating:", ratingInfo);
        res.json(ratingInfo);
    } else {
        console.log("No Pending Rating Found");
        res.json({ movieId: null, rating: null });
    }
});


app.get('/error', (req, res) => {
    res.render("error") 
});
app.use('/api', api);

app.use("/", authRoutes);
app.use("/", movieRoutes);
app.use("/", commentRoutes);
app.use("/", ratingRoutes);
app.use("/", favoriteRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
