const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jobController = require('../controllers/jobController');


// create job route
router.get('/create', auth, (req, res) => {
    res.render('create', {
        req
    })
});

router.post('/create', auth, jobController.create);

// view my jobs route
router.get('/myjobs', auth, jobController.myJobs);

// update job route
router.get('/update/:id', auth, jobController.updateGet);

router.post('/update', auth, jobController.update);

// delete job route
router.get('/delete/:id', auth, jobController.delete);

// search job page route
router.get('/search', (req, res) => {
    res.render('search', {
        req,
        location: 'All'
    })
});

// search job route
router.get('/find', jobController.search);

// view job route
router.get('/view/:id', jobController.view);

module.exports = router;