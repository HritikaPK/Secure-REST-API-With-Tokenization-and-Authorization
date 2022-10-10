// Import dependencies
require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req, res, next){
    const token = req.header("AUTH_TOKEN");
    if (!token) return res.status(401).send({
        ok: false,
        error: "Access denied. No token provided"
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  //secret key hidden in env
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: error.message

        });
    }

   
}
module.exports = auth;