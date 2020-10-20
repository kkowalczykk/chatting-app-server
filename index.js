const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
      socket.on('join', ({ name, room }) => {
            const user = addUser({ id: socket.id, name, room });
            socket.emit('message', { user: 'admin', text: `Hello ${user.name}.` })
            socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} joined.` })

            socket.join(user.room);
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      });

      socket.on('disconnect', () => {
            const removed = removeUser(socket.id)
            if (removed) {

                  io.to(removed.room).emit('message', { user: 'admin', text: `${removed.name} left chat.` });
                  io.to(removed.room).emit('roomData', { room: removed.room, users: getUsersInRoom(removed.room) });
            }
      });

      socket.on('sendMessage', (message) => {
            const user = getUser(socket.id);
            io.to(user.room).emit('message', { user: user.name, text: message })
      })

});

app.use(cors());
app.use(router);
server.listen(port, () => console.log(`Server has started on port: ${port}`));