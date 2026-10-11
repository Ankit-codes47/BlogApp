require("dotenv").config();

const crypto = require("crypto");
if (!globalThis.crypto) {
    globalThis.crypto = crypto.webcrypto;
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const passportConfig = require("./config/passport");
const passport = require("passport");
const { MongoStore } = require("connect-mongo");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoutes");
const methodOverride = require("method-override");
const authRoutes = require("./routes/authRoutes");

const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;

//*Middlewares: passing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//*session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: mongoUri ? MongoStore.create({ mongoUrl: mongoUri }) : undefined,
    })
);

//*method override middleware
app.use(methodOverride("_method"));

//*Passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

//*Home page
app.get("/", (req, res) => {
    res.render("home", {
        user: req.user,
        error: "",
        title: "Home",
    });
});

//*ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//*Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);

//*error handler
app.use(errorHandler);

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running up on http://localhost:${PORT}`);
    });
};


if (require.main === module) {
    mongoose
        .connect(mongoUri)
        .then(() => {
            console.log("MongoDB connected successfully");

            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Database connection failed:", error.message);
            process.exit(1);
        });
}

module.exports = app;