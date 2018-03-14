const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../../models/User');

module.exports = new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    const newRep = new User({ 
        email: email.trim(), 
        password: password.trim(), 
        verified: false, 
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
    });
    return newRep.save()
        .then((user) => {
            return done(null, user);
        })
        .catch(err => {
            if (err) return done(err);
        });
});    