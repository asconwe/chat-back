const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const USERNAME_PASSWORD_ERR = 'Incorrect username or password.'
const NOT_VERIFIED_ERR = 'You need to verify your email address.'

// User model
const { User } = require('../../../models/User');

module.exports = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const query = User.where({ email })
    query.findOne((err, user) => {
            if (err) { return done(err); }

            // Invalid email 
            if (!user) {
                return done(null, false, USERNAME_PASSWORD_ERR);
            }
            user.validatePassword(password, (isValid) => {

                // Invalid password
                if (!isValid) {
                    return done(null, false, USERNAME_PASSWORD_ERR);
                }

                if (!user.verified) {
                    return done(null, false, NOT_VERIFIED_ERR)
                }

                // Successful login attempt
                return done(null, user); // Success
            })
        })
})