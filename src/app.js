require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes"); 
const movieRoutes = require("./routes/movieRoutes");
const commentRoutes = require("./routes/commentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const api = require('./routes/api');
const path = require('path');  
const sessionMiddleware = require('../src/middlewares/sessionMiddleware');
const indexController = require("../src/controllers/indexController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(sessionMiddleware);

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

app.get("/test", (req, res) => {
    res.render("test");
});


app.get("/register", (req, res) => {
    res.render("register");  
});

app.get('/error', (req, res) => {
    res.render("error") 
});
app.use('/api', api);

app.use("/", authRoutes);
app.use("/", movieRoutes);
app.use("/", commentRoutes);
app.use("/", ratingRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
