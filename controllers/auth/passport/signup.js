const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Rep} = require('../../../models/Rep');

module.exports = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const newRep = new Rep({ email: email.trim(), password: password.trim(), verified: false });
    return newRep.save()
        .then((user) => {
            return done(null, user);
        })
        .catch(err => {
            if (err) return done(err);
        });
});    