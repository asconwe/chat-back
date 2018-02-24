const post = require('./post');
const put = require('./put');
const get = require('./get');

module.exports = (app) => {
    get(app);
    post(app);
    put(app);
}