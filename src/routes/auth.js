const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } = require('../config');
const authMiddleware = require('../middleware/auth');

const router = Router();

// TODO: replace with real database
const users = [
	{ id: '1', username: 'alice', password: 'a' },
	{ id: '2', username: 'bob', password: 'b' },
];

// TODO: replace with persistent store
// Map<userId, Set<refreshToken>>
const refreshTokenStore = new Map();

const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict',
	path: '/'
};

function addRefreshToken(userId, token) {
	if (!refreshTokenStore.has(userId)) {
		refreshTokenStore.set(userId, new Set());
	}
	refreshTokenStore.get(userId).add(token);
}

function hasRefreshToken(userId, token) {
	return refreshTokenStore.get(userId)?.has(token) ?? false;
}

function deleteRefreshToken(userId, token) {
	refreshTokenStore.get(userId)?.delete(token);
}

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: 'username and password are required' });
	}

	const user = users.find((u) => u.username === username && u.password === password);

	if (!user) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const payload = { id: user.id };

	const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
	const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

	addRefreshToken(user.id, refreshToken);

	res
		.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 })
		.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
		.json({ user: { id: user.id } });
});

router.get('/me', authMiddleware, (req, res) => {
	res.json({ user: { id: req.user.id } });
});

router.post('/refresh', (req, res) => {
	const token = req.cookies.refreshToken;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const { id } = jwt.verify(token, JWT_REFRESH_SECRET);

		if (!hasRefreshToken(id, token)) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const newRefreshToken = jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
		const accessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		deleteRefreshToken(id, token);
		addRefreshToken(id, newRefreshToken);

		res
			.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 })
			.cookie('refreshToken', newRefreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
			.json({ user: { id } });
	} catch {
		res.status(401).json({ message: 'Invalid or expired refresh token' });
	}
});

router.post('/logout', (req, res) => {
	const token = req.cookies.refreshToken;

	if (token) {
		try {
			const { id } = jwt.verify(token, JWT_REFRESH_SECRET);
			deleteRefreshToken(id, token);
		} catch {
			// token already expired or invalid, nothing to revoke
		}
	}

	res
		.clearCookie('accessToken', { path: '/' })
		.clearCookie('refreshToken', { path: '/' })
		.json({ message: 'Logged out' });
});

module.exports = router;