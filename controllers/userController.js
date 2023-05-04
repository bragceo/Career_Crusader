// controllers/userController.js

import express from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth.js';
import { User } from '../models/user.js';

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
			password: bcrypt.hashSync(password, 10),
		});

		const payload = {
			user: {
				id: user.id,
			},
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

// @route   POST api/users/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ msg: 'Invalid email or password' });
		}

		const isMatch = bcrypt.compareSync(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ msg: 'Invalid email or password' });
		}

		const payload = {
			user: {
				id: user.id,
			},
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

// @route   GET api/users
// @desc    Get user by token
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });

		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

export default router;
