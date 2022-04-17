const http	 = require('http');
const express = require('./config/express');

(async () => {
	
	try {
		const httpServer = http.createServer(app)
			.listen(3000)
			.on('listening', () => {
				const addr = httpServer.address();
				const bind = typeof addr === 'string' ? `Pipe ${ addr }` : `Port ${ addr.port }.`;
				console.log('HTPPS Server started at: ', bind);
			})
			.on('error', error => {
				if (error.syscall !== 'listen')
					throw error;

				const bind = typeof port === 'string' ? `Pipe ${ port }` : `Port ${ port }.`;

				switch (error.code) {
					case 'EACCES':
						console.error(`${ bind } Requires Elevated Privileges.`);
						process.exit(1);
					case 'EADDRINUSE':
						console.error(`${ bind } Is Already In Use.`);
						process.exit(1);
					default:
						throw error;
				}
			});
	}
	catch (error) {
		console.log(error);
	}
})();