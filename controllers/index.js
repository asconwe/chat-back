const auth = require('./auth');
const registration = require('./registration')
const dashboard = require('./dashboard')

module.exports = (app) => {
    auth(app);
    registration(app);    
    dashboard(app);
}