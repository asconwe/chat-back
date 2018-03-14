const authLogin = require('./auth-login');
const authSignup = require('./auth-signup');
const authLogout = require('./auth-logout');
const authVerification = require('./auth-verification');

module.exports = (app) => {
    authLogin(app);
    authSignup(app);
    authLogout(app);
    authVerification(app);
}