class User {
  constructor(username, id, socket_id) {
    this.username = username;
    this.id = id;
    this.socket_id = socket_id;

    this.status = "offline";

    this.dialogs = new Object();
  }

  online() {
    this.status = "online";
  }

  isOnline() {
    return this.status === "online";
  }

  offline() {
    this.status = "offline";
  }

  isOffline() {
    return this.status === "offline";
  }

  getDialog(dialogName) {
    return this.dialogs[dialogName] ? this.dialogs[dialogName] : null;
  }

  addDialog(dialogName, dialogId, unread, messages) {
    this.dialogs[dialogName] = {
      name: dialogName,
      id: dialogId,
      unread,
      messages
    };
  }
}

module.exports.user = User;

class UserStorage {
  constructor() {
    this.users = new Object();
  }

  push(user) {
    if (user instanceof User) {
      this.users[user.username] = user;
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

  getUser(username) {
    return this.users[username] ? this.users[username] : null;
  }

  getUserById(id) {
    const users = Object.keys(this.users);

    let currentUser = null;

    if (users.length > 0) {
      for (let user of users) {
        if (this.users[user].id === id) {
          currentUser = this.users[user];
        }
      }
    }

    return currentUser;
  }
}

module.exports.us = UserStorage;
