module.exports = {
	PORT: process.env.PORT || 3000,
	CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
	JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'change_this_refresh_secret',
	JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
