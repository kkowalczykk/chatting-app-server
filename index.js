const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
      console.log('New connection.');



      socket.on('disconnect', () => {
            const removed = removeUser(socket.id);
            console.log(removed);
      });

      socket.on('join', ({ name, room }) => {
            const user = addUser({ id: socket.id, name, room });
            console.log(user);
            socket.emit('message', { user: 'admin', text: `Hello ${user.name}.` })
            socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} joined.` })

            socket.join(user.room);
      })
});


app.use(router);
server.listen(port, () => console.log(`Server has started on port: ${port}`));