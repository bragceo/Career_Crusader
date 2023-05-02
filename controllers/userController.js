// controllers/userController.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const { User } = require('../models');

const router = express.Router();

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      let user = await User.findOne({ where: { email } });
  
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = await User.create({
        email,
        password: bcrypt.hashSync(password, 10)
      });
  
      const payload = {
        user: {
          id: user.id
        }
      };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });