const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const { Site } = require('../models/Site')
const socket_io = require('socket.io');
const { server, sessionStore } = require('../initServer');


function createSiteNameSpace(namespace) {
    const io = socket_io(server)
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
            console.log(`Rep ${user.firstName} ${user.lastName} connected`);
            const siteId = user.sites[0];
            socket.on('chat message', (socket) => {
                console.log('socket', socket);
            });
        }
        else {
            console.log(`End user connected in room:`, socket.id);
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
    const nio = createSiteNameSpace(site_id)
}

module.exports = {
    socketServer: connectAllSites,
    connectNewSite,
}