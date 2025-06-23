const passport = require('passport');

exports.authenticateJWT = passport.authenticate('jwt', { session: false });

exports.authenticateLocal = passport.authenticate('local', { session: false });

exports.authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
});
