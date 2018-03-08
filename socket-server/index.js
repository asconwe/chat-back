const socket_io = require('socket.io');

module.exports = (server) => {
    const io = socket_io(server)
    io.use((socket, next) => {
        console.log(socket.request)
        if (socket.request.headers.cookie) return next();
        next(new Error('Authentication error'));
    })
    io.on('connection', (socket) => {
        console.log('new connection')
        console.log(socket);
        socket.on('chat message', (socket) => {
            console.log(socket)
        })
    })
}