const validator = require('validator');

const authenticateValidator = () => {
  const verifyLoginRequest = (req, res, next) => {
    const payload = req.body;

    if (!payload || typeof payload.username !== 'string' || !validator.isLength(payload.username, { min: 1, max: 256 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid username!' });
    }

    if (!payload || typeof payload.password !== 'string' || !validator.isLength(payload.password, { min: 1, max: 256 })) {
      return res.status(400).send({ isSuccessful: false, message: 'Invalid user or password!' });
    }

    return next();
  };

  return {
    verifyLoginRequest,
  };
};

module.exports = authenticateValidator;
