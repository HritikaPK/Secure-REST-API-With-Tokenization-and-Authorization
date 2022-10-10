// Import dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const express = require("express");
const UserLogs = require("../models/UserLogs");
const { Router } = require("express");

// Setup express server router
const router = express.Router();

// on post
router.post("/", async (req,res) => {

let user = UserLog.find(u => u.Username === req.body.Username)
if (!user) throw new Error("Invalid username or password!")

const valid = await bcrypt.compare(req.body.Password, user.password)
if (!valid) throw new Error("Invalid username or password")

const token = jwt.sign({
  
    id: user.idnum,
    roles: user.Role
}, "jwtPrivateKey", { expiration: "30m" });

res.send({
    ok: true,
    token: token
});


});

// export the router
module.exports=router

/*
module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send({
        ok: false,
        error: "Access denied. No token provided"
    });

    try {
        const decoded = jwt.verify(token, "jwtPrivateKey");
        req.user = decoded;
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Token expired"
        });
    }

    next();
} */