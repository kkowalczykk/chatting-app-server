let users = [];

const addUser = ({ id, name, room }) => {
      name = name.toString().trim().toLowerCase();
      room = room.toString().trim().toLowerCase();


      const existingUser = users.find((user) => user.room === room && user.name === name);

      if (existingUser) {
            return { err: 'Username is taken' };
      }

      const user = { id, name, room };

      users.push(user);
      return user;
}


const removeUser = (id) => {
      const index = users.findIndex((user) => user.id == id);
      if (index != -1) {
            return users.splice(index, 1)[0];
      } else return users;
}

const getUser = (id) => {
      return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
      return users.filter((user) => user.room == room)
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom };