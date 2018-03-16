const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const { Site } = require('../models/Site')
const socket_io = require('socket.io');


function createSiteNameSpace(namespace, server, sessionStore) {
    const io = socket_io(server)
    const ioAuth = passportSocketIo.authorize({
        cookieParser,
        key: 'connect.sid',
        secret: process.env.SECRET,
        store: sessionStore,
        fail: ({ user }, message, critical, accept) => {
            console.log('=======data===========\n', user)
            if (user.logged_in === false) {
                return accept();
            }
            return accept(new Error(message));
        }
    })
    const nio = io.of(namespace)
    nio.use(ioAuth);
    nio.use((socket, next) => {
        console.log(socket)
        next();
    })
    return nio;
}

function connectSocket(nio) {
    nio.on('connection', (socket) => {
        const { user } = socket.request;
        if (user.logged_in) {
            // do rep things, like validate the site
            console.log(`Rep ${user.firstName} ${user.lastName} connected`);
            const siteId = user.sites[0];
            console.log(siteId);
            socket.on('chat message', (socket) => {
                console.log('socket', socket);
            });
        }
        else {
            console.log(`End user connected in room:`, socket.id);
        }
    });
}

module.exports = (server, sessionStore) => {
    Site.find({})
        .then(sites => {
            sites.forEach(site => {
                const nio = createSiteNameSpace(site._id.toString(), server, sessionStore)
                connectSocket(nio);
            });
        })
        .catch(err => {
            console.log(err)
        })
}