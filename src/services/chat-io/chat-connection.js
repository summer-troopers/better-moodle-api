const createRepositoryChat = require('../../repositories/repository-factory');

module.exports = async function chat(io, connection) {
  const repositoryChat = createRepositoryChat(connection.models.ChatUser);
  users = [];
  objectMessageDb = [];
  connections = [];

  io.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', () => {
      users.splice(users.indexOf(socket.username), 1);
      updateUsernames();
      connections.splice(connections.indexOf(socket), 1);

      console.log('Disconnected: %s sockets connected', connections.length);
    });


    socket.on('view messages', (objectMessageDb) => {
      for (let i = 0; i < objectMessageDb.length; i += 1) {
        io.sockets.emit('new message', { msg: objectMessageDb[i].message, user: objectMessageDb[i].idUser });
      }
    });

    socket.on('send message', (message) => {
      console.log(message);
      const idUser = '1';
      const currentTime = new Date();
      let time = ('0' + currentTime.getDate()).slice(-2) + '-' + ('0' + (currentTime.getMonth() + 1)).slice(-2) + '-' + currentTime.getFullYear() + ' ' + ('0' + currentTime.getHours()).slice(-2) + ':' + ('0' + currentTime.getMinutes()).slice(-2) + ':' + ('0' + currentTime.getSeconds()).slice(-2);
      time = time.toString();
      try {
        const result = repositoryChat.add({ idUser, time, message });
        if (!result) throw new Error('User does not exist');
      } catch (error) {
        console.log(error);
      }

      io.sockets.emit('new message', { msg: message, user: socket.username });
      repositoryChat.list()
        .then((result) => {
          for (let i = 0; i < result.length; i += 1) {
            objectMessageDb[i] = result[i].dataValues;
          }
        })
        .catch(console.error);
    });

    socket.on('new user', (data, callback) => {
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    updateUsernames = () => {
      io.sockets.emit('get users', users);
    };
  });
};
