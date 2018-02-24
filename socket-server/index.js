const socket_io = require('socket.io');

module.exports = (server) => {
    const io = socket_io(server)

    io.on('connection', (socket) => {
        console.log('new connection')
        
        socket.on('chat message', (socket) => {
            console.log(socket)
        })
    })
}