const fs = require('fs');
const path = require('path');
const dbSelects = require('../../utils/dbSelects');

const JWT_STRATEGY = require('passport-jwt').Strategy
const EXTRACT_JWT = require('passport-jwt').ExtractJwt;

let PATH_TO_RSA_PUBLIC_KEY = path.join(__dirname, '../../.keys/', 'RSA_PUBLIC_KEY.pem');
let RSA_PUBLIC_KEY = fs.readFileSync(PATH_TO_RSA_PUBLIC_KEY, 'utf-8');

let options = {
	jwtFromRequest: EXTRACT_JWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: RSA_PUBLIC_KEY,
	algorithms: ['RS256']
}

let passport = (repository, passport) => {
	passport.use(new JWT_STRATEGY(options, (JWT_Payload, done) => {
		try {
			const exp = +(JWT_Payload.exp.toString() + '000');
			const now = +(new Date());
			if(exp < 1639065329592) {
				return done(false, null);
			}
			if(now > exp) {
				return done(false, null);
			}
			repository.query(
				{
					query: dbSelects.findUserById(JWT_Payload.sub)
				},
				(table, row) => {
					if (!row || !row[0]) {
						return done(false, null);
					} else {
						return done(null, row[0]);
					}
				}
			);
		} catch(e) { console.log(e);}
	}));
}

module.exports.passport = passport;