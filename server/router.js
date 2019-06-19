const fs = require("./modules/filesStorage");
const userStorage = require("./modules/user").us;
const user = require("./modules/user").user;

fs.watch();

const pg = require("pg");
const Pool = pg.Pool;

const us = new userStorage();

const pool = new Pool({
  user: "kh_chat",
  host: "localhost",
  database: "kh_chat",
  password: "53574268sat",
  port: 5432
});

const router = (socket, io) => {
  console.log("Connected: " + socket.id);

  socket.on("fetch_login", async request => {
    let response = new Object();

    try {
      console.log("fetch_login", request.username);

      const { username, data } = request;

      const result = await pool.query("select * from users where user_name = $1", [username]).catch(err => {
        throw err;
      });

      if (result.rowCount === 1) {
        const { user_id, user_name } = result.rows[0];

        if (data !== null) {
          fs.addFile(username, data.postfix, data.file);
        }

        response = {
          username: user_name,
          userid: user_id,
          logoSrc: fs.getFiles(user_name, true)
        };
      } else {
        await pool.query("insert into users(user_name) values($1)", [username]).catch(err => {
          throw err;
        });

        const new_user = await pool.query("select * from users where user_name = $1", [username]).catch(err => {
          throw err;
        });

        const { user_id, user_name } = new_user.rows[0];

        if (data !== null) {
          fs.addFile(username, data.postfix, data.file);
        }

        response = {
          username: user_name,
          userid: user_id,
          logoSrc: fs.getFiles(user_name, true)
        };
      }

      socket.emit("fetch_login_success", response);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("fetch_dialogs", async request => {
    console.log("fetch_dialogs", request.username);

    try {
      const { username, user_id } = request;

      const dialogs = await pool.query(
        "select chat.chat_name, chat.chat_id from party, chat where party.chat_id = chat.chat_id and party.user_id = $1",
        [user_id]
      );

      let response = null;

      if (dialogs.rowCount > 0) {
        response = new Object();

        const tuples = dialogs.rows;

        for (let tuple of tuples) {
          const { chat_name, chat_id } = tuple;

          socket.join(chat_id);

          const requestMessages = await pool
            .query(
              "select m.message_id, m.chat_id, u.user_name, m.user_id, m.content, m.date_send, s.status from messages as m, message_status as s, users as u where m.chat_id = $1 and m.message_id = s.message_id and s.user_id = $2 and u.user_id = m.user_id order by date_send desc",
              [chat_id, user_id]
            )
            .catch(err => {
              throw err;
            });

          const messages = requestMessages.rows.map(val => ({
            message_id: val.message_id,
            chat_id: val.chat_id,
            user_name: val.user_name,
            logo_src: fs.getFiles(val.user_name, true),
            user_id: val.user_id,
            content: val.content,
            date_send: val.date_send,
            status: val.status
          }));

          const unread = messages.filter(val => val.status === "unread").length;

          const requestUsers = await pool
            .query("select u.user_name, u.user_id from users u, party p where u.user_id = p.user_id and p.chat_id = $1", [chat_id])
            .catch(err => {
              throw err;
            });

          const users = requestUsers.rows.map(val => ({
            user_name: val.user_name,
            user_id: val.user_id,
            user_logo_src: fs.getFiles(val.user_name, true)
          }));

          response[chat_id] = {
            chatName: chat_name,
            chatId: chat_id,
            chatLogoSrc: fs.getFiles(chat_name, true),
            firstMessage:
              messages.length > 0
                ? {
                    sender: messages[0].user_name,
                    content: messages[0].content
                  }
                : null,
            unreadCounter: unread > 0 ? unread : null,
            dateSend: messages.length > 0 ? messages[0].date_send : null,
            messages,
            users,
            messageCount: messages.length
          };
        }
      }

      socket.emit("fetch_dialogs_success", response);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("fetch_all_dialogs", async request => {
    console.log("fetch_all_dialogs");

    try {
      const dialogs = await pool.query("select chat.chat_name, chat.chat_id from chat");

      let response = null;

      if (dialogs.rowCount > 0) {
        response = new Object();

        const tuples = dialogs.rows;

        for (let tuple of tuples) {
          const { chat_name, chat_id } = tuple;

          const requestMessages = await pool
            .query(
              "select m.message_id, m.chat_id, u.user_name, m.user_id, m.content, m.date_send, s.status from messages as m, message_status as s, users as u where m.chat_id = $1 and m.message_id = s.message_id and s.user_id = u.user_id and u.user_id = m.user_id order by date_send desc",
              [chat_id]
            )
            .catch(err => {
              throw err;
            });

          const messages = requestMessages.rows.map(val => ({
            message_id: val.message_id,
            chat_id: val.chat_id,
            user_name: val.user_name,
            logo_src: fs.getFiles(val.user_name, true),
            user_id: val.user_id,
            content: val.content,
            date_send: val.date_send,
            status: val.status
          }));

          const unread = messages.filter(val => val.status === "unread").length;

          const requestUsers = await pool
            .query("select u.user_name, u.user_id from users u, party p where u.user_id = p.user_id and p.chat_id = $1", [chat_id])
            .catch(err => {
              throw err;
            });

          const users = requestUsers.rows.map(val => ({
            user_name: val.user_name,
            user_id: val.user_id,
            user_logo_src: fs.getFiles(val.user_name, true)
          }));

          response[chat_id] = {
            chatName: chat_name,
            chatId: chat_id,
            chatLogoSrc: fs.getFiles(chat_name, true),
            firstMessage:
              messages.length > 0
                ? {
                    sender: messages[0].user_name,
                    content: messages[0].content
                  }
                : null,
            unreadCounter: unread > 0 ? unread : null,
            dateSend: messages.length > 0 ? messages[0].date_send : null,
            messages,
            users,
            messageCount: messages.length
          };
        }
      }

      socket.emit("fetch_all_dialogs_success", response);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("fetch_dialog", async request => {
    console.log("fetch_dialog", request.username);

    try {
      const { username, user_id, chatid } = request;

      const dialog = await pool.query(
        "select chat.chat_name, chat.chat_id from party, chat where party.chat_id = chat.chat_id and party.user_id = $1 and party.chat_id = $2",
        [user_id, chatid]
      );

      let response = null;

      if (dialog.rowCount > 0) {
        const { chat_name, chat_id } = dialog.rows[0];

        const requestMessages = await pool
          .query(
            "select m.message_id, m.chat_id, u.user_name, m.user_id, m.content, m.date_send, s.status from messages as m, message_status as s, users as u where m.chat_id = $1 and m.message_id = s.message_id and s.user_id = $2 and u.user_id = m.user_id order by date_send desc",
            [chat_id, user_id]
          )
          .catch(err => {
            throw err;
          });

        const messages = requestMessages.rows.map(val => ({
          message_id: val.message_id,
          chat_id: val.chat_id,
          user_name: val.user_name,
          logo_src: fs.getFiles(val.user_name, true),
          user_id: val.user_id,
          content: val.content,
          date_send: val.date_send,
          status: val.status
        }));

        const unread = messages.filter(val => val.status === "unread").length;

        const requestUsers = await pool
          .query("select u.user_name, u.user_id from users u, party p where u.user_id = p.user_id and p.chat_id = $1", [chat_id])
          .catch(err => {
            throw err;
          });

        const users = requestUsers.rows.map(val => ({
          user_name: val.user_name,
          user_id: val.user_id,
          user_logo_src: fs.getFiles(val.user_name, true)
        }));

        response = {
          chatName: chat_name,
          chatId: chat_id,
          chatLogoSrc: fs.getFiles(chat_name, true),
          firstMessage:
            messages.length > 0
              ? {
                  sender: messages[0].user_name,
                  content: messages[0].content
                }
              : null,
          unreadCounter: unread > 0 ? unread : null,
          dateSend: messages.length > 0 ? messages[0].date_send : null,
          messages,
          users,
          messageCount: messages.length
        };
      }

      // console.log(123);

      socket.emit("fetch_dialog_success", response);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("send_message", async request => {
    console.log("send_message", request);

    try {
      const { chatId, userId, userName, content } = request;

      const date = new Date();

      await pool.query("insert into messages(chat_id, user_id, content, date_send) values($1, $2, $3, $4)", [
        +chatId,
        +userId,
        content,
        date
      ]);

      const new_message = await pool
        .query("select message_id from messages where chat_id = $1 and user_id = $2 and content = $3 and date_send = $4", [
          chatId,
          userId,
          content,
          date
        ])
        .catch(err => {
          throw err;
        });

      const { message_id } = new_message.rows[0];

      const users = (await pool
        .query("select u.user_id from users u, party p where u.user_id = p.user_id and p.chat_id = $1", [chatId])
        .catch(err => {
          throw err;
        })).rows;

      for (let user of users) {
        const { user_id } = user;

        let status = "unread";

        if (user_id === userId) {
          status = "read";
        } else if (userId !== userId) {
          status = "unread";
        }

        await pool.query("insert into message_status values($1, $2, $3)", [+message_id, +user_id, status]).catch(err => {
          throw err;
        });
      }

      socket.emit("send_message_success", chatId);
      socket.broadcast.to(chatId).emit("new_message", chatId);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("read_message", async request => {
    console.log("read_message", request);

    const { userId, chatId } = request;

    try {
      const messages = (await pool.query("select message_id from messages where chat_id = $1", [chatId]).catch(err => {
        throw err;
      })).rows;

      for (let message of messages) {
        const { message_id } = message;

        await pool
          .query("update message_status set status='read' where user_id = $1 and message_id = $2", [userId, message_id])
          .catch(err => {
            throw err;
          });
      }

      socket.emit("read_message_success");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("add_chat", async request => {
    const { chatName, userId, users, data } = request;

    try {
      await pool.query("insert into chat(chat_name, user_id) values($1, $2)", [chatName, userId]).catch(err => {
        throw err;
      });

      const newChatId = (await pool.query("select chat_id from chat order by chat_id desc limit 1").catch(err => {
        throw err;
      })).rows[0].chat_id;

      users.forEach(async val => {
        await pool.query("insert into party values($1, $2)", [newChatId, val]).catch(err => {
          throw err;
        });
      });

      if (data !== null) {
        fs.addFile(chatName, data.postfix, data.file);
      }

      io.emit("add_chat_success");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("get_users", async request => {
    try {
      const requestUsers = (await pool.query("select * from users")).rows;

      const users = requestUsers.map(val => ({
        user_name: val.user_name,
        user_id: val.user_id,
        user_logo_src: fs.getFiles(val.user_name, true)
      }));

      socket.emit("get_users_success", users);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", request => {
    console.log("Disconnected: " + socket.id);
  });
};

module.exports = router;
