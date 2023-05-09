const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const feedbackController = require('../controllers/feedbackController');


// upvote route
router.get('/upvote/:id', auth, feedbackController.upvote);

//
router.get('/downvote/:id', auth, feedbackController.downvote);

// create comment feedback route

router.post('/comment', auth, feedbackController.create);

module.exports = router;