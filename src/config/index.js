module.exports = {
	PORT: process.env.PORT || 3000,
	CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
	JWT_SECRET: process.env.JWT_SECRET || 'http://localhost:5174',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
