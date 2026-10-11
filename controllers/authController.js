const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const passport = require("passport");

//*Render login page
exports.getLogin = asyncHandler((req, res) => {
    res.render("login", {
        title: "login",
        error: "",
        user: req.user,
    });
});

//*login logic
exports.login = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
         if(err) {
            return next(err);
         }
         if (!user) {
            return res.render("login", {
                title: "Login",
                user: req.user,
                error: info.message,
            });
         }
         req.login(user, (err) => {
            if(err) {
                return next(err);
            }
            return res.redirect("/");
         });
    })(req, res, next);
});

//*get register page
exports.getRegister = asyncHandler((req, res) => {
    res.render("register",{
        title: "Register",
        user: req.user,
        error: "",
    });
});

//*register logic
exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render("register", {
                title: "Register",
                user: req.user,
                error: "User already exists",
            });
        }
        //hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        //save user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        res.redirect("/auth/login");
    } catch (error) {
        res.render("register", {
            title: "Register",
            user: req.user,
            error: error.message,
        })
    }
});

//*logout
exports.logout = asyncHandler( (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/auth/login");
    });
});