import express from 'express';
import passport from 'passport';
import { register } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', (req, res) => {
	if (req.isAuthenticated() && req.user) {
		const { id, email, home_country } = req.user;
		return res
			.status(200)
			.json({ isAuthenticated: true, user: { id, email, home_country } });
	} else {
		res.status(401).json({ message: 'Not authenticated' });
	}
});

router.post('/register', register);

// Login route using passport local strategy
router.post(
	'/login',
	passport.authenticate('local', { session: true }),
	(req, res) => {
		const { id, email, home_country } = req.user;
		res.status(200).json({
			message: 'Login successful',
			user: { id, email, home_country },
		});
	}
);

router.post('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.session.destroy(() => {
			res.clearCookie('connect.sid');
			res.status(200).json({ message: 'Logout successful' });
		});
	});
});

export default router;
