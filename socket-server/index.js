const socket_io = require('socket.io');
const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');

module.exports = (server, sessionStore) => {
    const io = socket_io(server)
    const ioAuth = passportSocketIo.authorize({
        cookieParser,
        key: 'connect.sid',
        secret: process.env.SECRET,
        store: sessionStore,
    })

    io.use(ioAuth)

    io.on('connection', (socket) => {
        const { user } = socket.request;
        if (user) {
            // do rep things, like validate the site
            console.log(`Rep ${user.firstName} ${user.lastName} connected`);
            socket.on('chat message', (socket) => {
                console.log(socket)
            })
        } else {
            console.log(`End user connected`)
        }
        // console.log(socket.handshake);
    })
}