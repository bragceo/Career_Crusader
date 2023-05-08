const jwt = require('jsonwebtoken');
const User = require('../models/user');
const session = require('express-session');

module.exports = async (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        res.redirect('/login');
    }
    else {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            console.log(err);
            res.redirect('/login');
        }
    }
}