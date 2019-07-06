class User {
  constructor(username, id, socket_id) {
    this.username = username;
    this.id = id;
    this.socket_id = socket_id;

    this.status = "online";
  }
}

module.exports.user = User;

class UserStorage {
  constructor() {
    this.users = new Object();
  }

  push(user) {
    if (user instanceof User) {
      this.users[user.id] = user;
    } else {
      console.log("[push]: not user");
    }
  }

  delete(user) {
    if (user instanceof User) {
      const index = this.users.indexOf(user);

      if (index >= 0) {
        this.users.slice(index, 1);
      }
    } else {
      console.log("[delete]: not user");
    }
  }

  getUser(id) {
    return this.users[id] ? this.users[id] : null;
  }
}

module.exports.us = UserStorage;
