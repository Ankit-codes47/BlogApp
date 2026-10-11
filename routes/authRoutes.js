const express = require("express");
const User = require("../models/User");
const {
    getLogin,
    login,
    getRegister,
    register,
    logout,
} = require("../controllers/authController");

const authRoutes = express.Router();

//!=======================
//Routes
//!=======================
//*Login page
authRoutes.get("/login", getLogin);

//?main logic for user login
authRoutes.post("/login", login);

//*Register page
authRoutes.get("/register", getRegister);

//?Main logic for user registration
authRoutes.post("/register", register);

//*Logout
authRoutes.get("/logout", logout);


//!Module Export
module.exports = authRoutes;