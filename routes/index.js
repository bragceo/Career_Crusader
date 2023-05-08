const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const Job = require('../models/job');


// Index route
router.get('/', (req, res) => {
    Job.findAll({
        raw: true,
        nest: true,
    }).then(jobs =>
        res.render('index', {
            req,
            jobs
        })
    );
});

// login routes
router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    }
    else {
        res.render('login', {
            req
        })
    }
});

router.post('/login', userController.login);

// register route
router.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    }
    else {
        res.render('register', {
            req
        })
    }
});

router.post('/register', userController.register);

// logout route
router.get('/logout', userController.logout);


module.exports = router;