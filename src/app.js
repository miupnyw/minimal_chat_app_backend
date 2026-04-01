const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

const allowedOrigins = [
	'http://localhost:5174',
	'http://127.0.0.1:5174'
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
app.use(express.json());
app.use('/api', routes);

module.exports = app;
