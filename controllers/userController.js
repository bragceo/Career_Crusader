const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const saltRounds = 10;

exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('register', {
                err: "Passwords do not match",
                username: username,
                email: email
            });
        }
        else {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await User.create({
                username,
                email,
                password: hashedPassword
            });
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            req.session.regenerate(function (err) {
                if (err) {
                    return res.status(400).json({ err });
                }
                req.session.user = user;
                req.session.token = token;
            });

            req.session.save(function (err) {
                if (err) {
                    return res.status(400).json({ err });
                }
                res.redirect('/');
            });
        }
    } catch (err) {
        console.log(err);
        res.render('register', {
            err: "Username or Email already exists",
            username: req.body.username,
            email: req.body.email
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            res.render('login', {
                err: 'Invalid Username',
                username: username
            })
        }
        else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
                req.session.regenerate(function (err) {
                    if (err) {
                        return res.status(400).json({ err });
                    }
                    req.session.user = user;
                    req.session.token = token;
                });

                req.session.save(function (err) {
                    if (err) {
                        return res.status(400).json({ err });
                    }
                    res.redirect('/');
                });
            } else {
                res.render('login', {
                    err: 'Invalid Password',
                    username: username
                })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
}

exports.logout = async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                return res.status(400).json({ err });
            }
            res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
}