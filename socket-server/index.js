const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const { Site } = require('../models/Site')
const socket_io = require('socket.io');
const { server, sessionStore } = require('../initServer');
const endUserSocketController = require('./endUserSocketController');
const repSocketController = require('./repSocketController');

function createSiteNameSpace(namespace) {
    const io = socket_io(server)
    // Node caps listeners at 10 to prevent memory leaks 
    // - we need to add a new listener for every site that is created or will hit that limit
    server.setMaxListeners(server.listenerCount('listening') + 1);
    const ioAuth = passportSocketIo.authorize({
        cookieParser,
        key: 'connect.sid',
        secret: process.env.SECRET,
        store: sessionStore,
        fail: ({ user }, message, critical, accept) => {
            if (user.logged_in === false) {
                return accept();
            }
            return accept(new Error(message));
        }
    })
    const nio = io.of(namespace)
    nio.use(ioAuth);
    return nio;
}

function connectSocket(nio) {
    nio.on('connection', (socket) => {
        const { user } = socket.request;
        if (user.logged_in) {
            // do rep things, like validate the site
            repSocketController(user, socket, nio);
        }
        else {
            endUserSocketController(nio, socket);
        }
    });
}

function connectAllSites() {
    Site.find({})
        .then(sites => {
            sites.forEach(site => {
                const nio = createSiteNameSpace(site._id.toString())
                connectSocket(nio);
            });
        })
        .catch(err => {
            console.log(err)
        })
}

function connectNewSite(site_id) {
    const nio = createSiteNameSpace(site_id);
    connectSocket(nio)
}

module.exports = {
    socketServer: connectAllSites,
    connectNewSite,
}