const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

const router = Router();

// TODO: replace with real database
const users = [
	{ id: '1', username: 'alice', password: 'password123' },
	{ id: '2', username: 'bob', password: 'password123' },
];

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: 'username and password are required' });
	}

	const user = users.find((u) => u.username === username && u.password === password);

	if (!user) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});

	const { exp } = jwt.decode(token);
	const expiresAt = new Date(exp * 1000)

	res.json({ token, expiresAt, user: { id: user.id, username: user.username } });
});

module.exports = router;