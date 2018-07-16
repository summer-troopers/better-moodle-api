
module.exports = function chat(req, res) {
  const express = require('express');

  const app = express();
  const server = require('http').createServer(app);

  const io = require('socket.io').listen(server);

  users = [];
  connections = [];

  res.sendFile(`${__dirname}/index.html`);


  io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', () => {
      users.splice(users.indexOf(socket.username), 1);
      updateUsernames();
      connections.splice(connections.indexOf(socket), 1);
      
      console.log('Disconnected: %s sockets connected',connections.length);
    });
    // Send Message
    socket.on('send message', (data) => {
      console.log(data);
      io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    // New User
    socket.on('new user', (data, callback) => {
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    function updateUsernames() {
      io.sockets.emit('get users', users);
    }
  });
}
