const errors = require('@feathersjs/errors');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function createAuthorizationVerifier(userRepository) {
  return {
    validateToken: extractAuthorizationToken,
    verifierId: verifyUserId,
    validateUser: [extractAuthorizationToken, verifyUserId],
  };

  // eslint-disable-next-line complexity
  function extractAuthorizationToken(request, response, next) {
    const token = request.headers.token || request.body.token;
    if (!token) return next(new errors.Forbidden());
    try {
      request.token = jwt.verify(token, config.jwtconf.secret);
      if (typeof request.token.user !== 'number' || !request.token.userRole) throw new errors.Forbidden();
    } catch (err) {
      return next(new errors.Forbidden());
    }

    return next();
  }

  function verifyUserId(request, response, next) {
    return userRepository.exists(request.token.user, request.token.userRole)
      .then((result) => {
        if (!result) return next(new errors.Forbidden());
        return next();
      })
      .catch(next);
  }
};
