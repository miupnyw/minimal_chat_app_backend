const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();

const allowedOrigins = [
	'http://localhost:8080',
	'http://127.0.0.1:8080'
]

app.use(cors({
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);

module.exports = app;
