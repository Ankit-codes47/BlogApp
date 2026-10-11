
require("dotenv").config();

const crypto = require("crypto");
if (!globalThis.crypto) {
    globalThis.crypto = crypto.webcrypto;
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
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

const mongoUri =
    process.env.MONGODB_URI || process.env.MONGODB_URL;

const PORT = process.env.PORT || 3000;

// MongoDB connection management
let connectionPromise;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!mongoUri) {
        throw new Error("MongoDB connection URI is missing");
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(mongoUri, {
                serverSelectionTimeoutMS: 10000,
            })
            .then(() => {
                console.log("MongoDB connected successfully");
                return mongoose.connection;
            })
            .catch((error) => {
                connectionPromise = null;
                throw error;
            });
    }

    return connectionPromise;
};

// Middleware: passing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        next(error);
    }
});

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: mongoUri
            ? MongoStore.create({ mongoUrl: mongoUri })
            : undefined,
    })
);

// Method override middleware
app.use(methodOverride("_method"));

// Passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// Home page
app.get("/", (req, res) => {
    res.render("home", {
        user: req.user,
        error: "",
        title: "Home",
    });
});

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);

// Error handler
app.use(errorHandler);

// Local development server
if (require.main === module) {
    connectDB()
        .then(() => {
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
