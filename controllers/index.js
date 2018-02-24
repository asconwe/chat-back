const siteController = require('./site-controller');
const repController = require('./rep-controller');
const auth = require('./auth');

module.exports = (app) => {
    auth(app);
    siteController(app);
    repController(app);
}