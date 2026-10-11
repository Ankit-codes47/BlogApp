
require("dotenv").config();

const crypto = require("crypto");

if (!globalThis.crypto) {
    globalThis.crypto = crypto.webcrypto;
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const { MongoStore } = require("connect-mongo");
const methodOverride = require("method-override");

const userRoutes = require("./routes/userRoutes");
const passportConfig = require("./config/passport");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.set("trust proxy", 1);

const mongoUri =
    process.env.MONGODB_URI || process.env.MONGODB_URL;

const PORT = process.env.PORT || 3000;

// --------------------------------------------------
// MongoDB connection management
// --------------------------------------------------

let connectionPromise;

async function connectDB() {
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
}

// --------------------------------------------------
// Basic middleware
// --------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// --------------------------------------------------
// Connect to MongoDB before processing requests
// --------------------------------------------------

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        next(error);
    }
});

// --------------------------------------------------
// Session middleware
// --------------------------------------------------

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is missing in production");
}

app.use(
    session({
        secret: sessionSecret || "local-development-only-secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoUri,
            collectionName: "sessions",
        }),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

// --------------------------------------------------
// Passport
// --------------------------------------------------

passportConfig(passport);

app.use(passport.initialize());
app.use(passport.session());

// --------------------------------------------------
// EJS configuration
// --------------------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --------------------------------------------------
// Home page
// --------------------------------------------------

app.get("/", (req, res, next) => {
    try {
        res.render("home", {
            user: req.user,
            error: "",
            title: "Home",
        });
    } catch (error) {
        next(error);
    }
});

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);

// --------------------------------------------------
// 404 handler
// --------------------------------------------------

app.use((req, res) => {
    res.status(404).send("Page not found");
});

// --------------------------------------------------
// Detailed error logging
// Keep this after all routes
// --------------------------------------------------

app.use((err, req, res, next) => {
    console.error("REQUEST ERROR:", {
        path: req.originalUrl,
        method: req.method,
        message: err.message,
        stack: err.stack,
    });

    next(err);
});

// --------------------------------------------------
// Existing application error handler
// --------------------------------------------------

app.use(errorHandler);

// --------------------------------------------------
// Local development server
// Vercel imports the exported app instead
// --------------------------------------------------

if (require.main === module) {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Server startup failed:", error);
            process.exit(1);
        });
}

module.exports = app;
