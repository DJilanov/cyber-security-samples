const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const Passport = require('passport').Passport;
const passport = new Passport();

const init = async (repository, websocket) => {
	const app = express();

	require('../config/passport').passport(repository, passport);
	app.use(passport.initialize());

	var corsOptionsDelegate = (req, callback) => {
		var corsOptions;
		// if (whitelist.indexOf(req.header('Origin')) !== -1) {
		  	corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
		// } else {
		//   corsOptions = { origin: false } // disable CORS for this request
		// }
		callback(null, corsOptions) // callback expects two parameters: error and options
	}

	app.use(cors(corsOptionsDelegate));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cookieParser());
	app.use((req, res, next) => {
		res.setHeader('Strict-Transport-Security', 'max-age=63072000');
		res.setHeader('X-Frame-Options', 'SAMEORIGIN');
		res.setHeader('X-Content-Type-Options', 'nosniff');
		res.setHeader('Feature-Policy', '* none');
		res.setHeader('Content-Security-Policy', '* none');
		res.setHeader('Referrer-Policy', 'no-referrer');
		res.setHeader('Feature-Policy', "default-src 'self'; img-src https://*; child-src 'none';");
		next();
	});
	// app.use(helmet());

	// Routers
	require('./../../routes/authenticate/authenticate-router').attachTo(app, repository, passport);

	app.get('/heartbeat/', (req, res) => {
		res.status(200).send({ status: 'Im alive' });
	});

	app.use((_req, _res, next) => { next(createError(404)) });
	app.use((err, req, res, next) => {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.status(err.status || 500);
		next();
	});

	return app;
};

module.exports = {
	init
};