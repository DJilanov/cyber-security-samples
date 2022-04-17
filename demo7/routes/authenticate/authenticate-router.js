const { Router } = require('express');

const attachTo = (app, repository, passport) => {
	const router = new Router();
	const validator = require('./authenticate-validator')(repository);
	const controller = require('./authenticate-controller')(repository);

	router
		.post('/login/', validator.verifyLoginRequest, controller.loginAdmin)
		.get('/user/', passport.authenticate('jwt', { session: false }), controller.getUser)
		.get('/logout/', passport.authenticate('jwt', { session: false }), controller.logoutUser)

	app.use('/api', router);
};

module.exports = { attachTo };