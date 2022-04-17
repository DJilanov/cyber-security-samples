const dbSelects = require('../../utils/dbSelects');
const passwordUtilities = require('../../utils/passwordUtilities');
const fileController = require('../../services/file-controller');

const authenticateController = (repository) => {
	/*
		Login user
	*/
	const loginAdmin = async (req, res) => {
			const userData = req.body;
			const ip = req.headers['x-forwarded-for'] ||
				req.socket.remoteAddress ||
				null;
			return repository.query(
				{
					query: dbSelects.findUser(userData, 'a')
				},
				(table, row) => {
					if (!row[0]) {
						res.status(401).send({ Error: 'Invalid user or password!' });
					} else {
						const user = row[0];
						const isPasswordValid = passwordUtilities.isValidPassword(userData.password, user.password);

						if (isPasswordValid) {
							const tokenData = passwordUtilities.issueJWT(user);
							res.status(200).send({ id: user.id, username: user.username, name: user.name, Token: tokenData.Token, Expires: tokenData.Expires });
							// log the login
							repository.query({
								query: dbSelects.logAdmin({
									user_id: user.id,
									operation_command: 'login',
									operation_response: 'success',
									timestamp: +(new Date()),
								})
							}, () => {});
							fileController.logAdmin('', 'вход',{
								timestamp: Math.round((+(new Date())) / 1000),
								user,
								ip,
								room_id: '',
							});
						} else {
							res.status(401).json({ Error: "Invalid user or password!" });
						}
					}
				}
		);
	};

  	const getUser =  async (req, res) => {
		const user = req.user;
		if (!user) {
			res.status(401).send({ Error: 'Invalid user or password!' });
		} else {
			res.status(200).send({ id: user.id, username: user.username, name: user.name});
		}
	};

	const logoutUser = async(req, res) => {
		const user = req.user;
		const ip = req.headers['x-forwarded-for'] ||
			req.socket.remoteAddress ||
			null;
		if((req.get('host')).includes('tech')) {
			console.log('here1');
			fileController.logTech({
				timestamp: Math.round((+(new Date())) / 1000),
				user_id: user.id,
				roomId: '',
				user: {
					name: user.name
				},
				ip: ip,
				operation_command: 'изход',
				operation_response: 'ОК'
			});
		} else {
			console.log('here2');
			fileController.logAdmin('', 'изход',{
				timestamp: Math.round((+(new Date())) / 1000),
				user,
				ip,
				room_id: '',
			});
		}
		res.status(200).send({ ok: true });
	}

	return {
		loginAdmin,
		loginTechnic,
		getUser,
		logoutUser
	};
};

module.exports = authenticateController;