// Import required modules
const express = require('express');
const auth = require('../middlewares/auth');
const { Job } = require('../models');

// Create an Express router
const router = express.Router();

// @route   DELETE api/jobs/:id
// @desc    Delete a job by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the job by primary key (ID)
    const job = await Job.findByPk(req.params.id);

    // If the job is not found, return a 404 error
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // If the job's user ID doesn't match the authenticated user's ID, return a 401 error
    if (job.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete the job from the database
    await job.destroy();

    // Send a success message
    res.json({ msg: 'Job removed' });
  } catch (err) {
    // Log the error and return a 500 server error
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Export the router to be used in other parts of the application
module.exports = router;

// Other routes were explained in the previous response.
