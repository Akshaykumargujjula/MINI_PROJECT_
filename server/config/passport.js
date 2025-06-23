const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

module.exports = (passport) => {
    // JWT Strategy
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
            },
            async (jwt_payload, done) => {
                try {
                    const user = await User.findById(jwt_payload.id);
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );

    // Local Strategy
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email });
                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    }

                    const isMatch = await user.comparePassword(password);
                    if (!isMatch) {
                        return done(null, false, { message: 'Invalid password' });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Google Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (!user) {
                        user = await User.create({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            username: profile.displayName,
                        });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
};
