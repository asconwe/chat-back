const authLogin = require('./auth-login');
const authSignup = require('./auth-signup');
const authLogout = require('./auth-logout');

module.exports = (app) => {
    authLogin(app);
    authSignup(app);
    authLogout(app);
}