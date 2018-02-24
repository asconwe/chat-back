const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const USERNAME_PASSWORD_ERR = 'Incorrect username or password.'

// User model
const {Rep} = require('../../../models/Rep');

module.exports = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    Rep.findOne({ email: email }, (err, rep) => {
        if (err) { return done(err); }

        // Invalid email 
        if (!rep) {
            return done(null, false, { message: USERNAME_PASSWORD_ERR });
        }

        rep.validatePassword(password, (isValid) => {

            // Invalid password
            if (!isValid) {
                return done(null, false, { message: USERNAME_PASSWORD_ERR });
            }

            // Successful login attempt
            return done(null, rep); // Success
        })
    })
});