export const FETCH_LOGIN_SUCCESS = "FETCH_LOGIN_SUCCESS";

export const FETCH_DIALOGS_SUCCESS = "FETCH_DIALOGS_SUCCESS";
export const FETCH_DIALOG_SUCCESS = "FETCH_DIALOG_SUCCESS";

export const LOGIN_INTERFACE = "LOGIN_INTERFACE";
export const LOGOUT_INTERFACE = "LOGOUT_INTERFACE";

export const TOGGLE_ACTIVE_DIALOG = "TOGGLE_ACTIVE_DIALOG";

export const SET_SEARCH_WORD = "SET_SEARCH_WORD";

export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";

export const SHOW_MODAL = "SHOW_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const SET_MODAL = "SET_MODAL";

// accessory functions

const imageToDataURL = (image, callback) => {
    const reader = new FileReader();

    reader.onload = event => {
        let postfix = image.name.split(".");
        postfix = postfix[postfix.length - 1];

        const response = {
            postfix,
            file: event.target.result,
            size: event.total
        };

        callback(response);
    };

    return reader.readAsDataURL(image);
};

const checkName = username => {
    if (username === null) {
        console.log("null");
        return false;
    }

    username = username.trim();

    if (username === "") {
        console.log("empty");
        return false;
    }

    const reg = /^[^/?*:;{}\\]*\.?[^/?*:;{}\\]+$/;

    if (!RegExp(reg).test(username)) {
        console.log("invalid");
        return false;
    }

    return username;
};

// fetch login

export const fetchLogin = (socket, username, logoData) => (dispatch, getState) => {
    username = checkName(username);

    if (username === false) {
        return;
    }

    if (logoData !== null) {
        imageToDataURL(logoData, response => {
            const request = {
                username,
                data: response
            };

            login(request);
        });
    } else {
        const request = {
            username,
            data: null
        };

        login(request);
    }

    function login(request) {
        socket.emit("fetch_login", request);

        socket.on("fetch_login_success", response => {
            dispatch(fetchloginSuccess(response.username, response.userid, response.logoSrc));
            dispatch(loginInterface());
            dispatch(fetchDialogs(socket, response.username));
        });
    }

    socket.on("new_message", response => {
        dispatch(fetchDialog(socket, getState().user.username, response));
    });
};

export const fetchloginSuccess = (username, userid, logoSrc) => {
    document.cookie = `username=${username};`;

    return {
        type: FETCH_LOGIN_SUCCESS,
        payload: {
            username,
            userid,
            logoSrc
        }
    };
};

// fetch dialogs

export const fetchDialogs = (socket, username) => (dispatch, getState) => {
    username = checkName(username);

    if (username === false) {
        return;
    }

    socket.emit("fetch_dialogs", { username, user_id: getState().user.userid });

    socket.on("fetch_dialogs_success", response => {
        dispatch(fetchDialogsSuccess(response));

        if (getState().app.dialogs.currentDialog) {
            const currentChatId = getState().app.dialogs.currentDialog.chatId;

            dispatch(toggleActiveDialog(getState().app.dialogs.list[currentChatId]));
        }
    });
};

export const fetchDialogsSuccess = messages => {
    return {
        type: FETCH_DIALOGS_SUCCESS,
        payload: messages
    };
};

export const toggleActiveDialog = dialog => {
    return {
        type: TOGGLE_ACTIVE_DIALOG,
        payload: dialog
    };
};

export const fetchDialog = (socket, username, chatId) => (dispatch, getState) => {
    username = checkName(username);

    if (username === false) {
        return;
    }

    socket.emit("fetch_dialog", { username, user_id: getState().user.userid, chatid: chatId });

    socket.on("fetch_dialog_success", response => {
        console.log(response);

        if (!response) return;

        dispatch(fetchDialogSuccess(response));

        if (getState().app.dialogs.currentDialog) {
            const currentChatId = getState().app.dialogs.currentDialog.chatId;

            dispatch(toggleActiveDialog(getState().app.dialogs.list[currentChatId]));
        }
    });
};

export const fetchDialogSuccess = dialog => {
    return {
        type: FETCH_DIALOG_SUCCESS,
        payload: dialog
    };
};

// login interface

export const loginInterface = () => {
    return {
        type: LOGIN_INTERFACE
    };
};

export const logoutInterface = () => {
    return {
        type: LOGOUT_INTERFACE
    };
};

// search word

export const setSearchWord = word => {
    return {
        type: SET_SEARCH_WORD,
        payload: word ? word : null
    };
};

// send message

const checkContent = content => {
    let text = content.trim();

    text = text
        .replace(/\r?\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (text === "") {
        return null;
    }

    return text;
};

export const sendMessage = (socket, userId, userName, chatId, content) => (dispatch, getState) => {
    if (checkContent(content) === null) {
        console.log("empty");
        return;
    }

    const request = {
        chatId,
        userId,
        userName,
        content: content.trim()
    };

    socket.emit("send_message", request);

    let connection_on = true;

    socket.on("send_message_success", response => {
        if (connection_on) {
            dispatch(fetchDialog(socket, getState().user.username, response));

            connection_on = false;
        }
    });
};

// read message

export const readMessage = (socket, userId, chatId) => (dispatch, getState) => {
    const request = {
        userId,
        chatId
    };

    socket.emit("read_message", request);

    let connection_on = true;

    socket.on("read_message_success", response => {
        if (connection_on) {
            dispatch(fetchDialogs(socket, getState().user.username));
            connection_on = false;
        }
    });
};

// add chat

export const addChat = (socket, chatName, userId, users, logoData) => (dispatch, getState) => {
    if (chatName === null || userId === null || users.length === 0) {
        return;
    }

    chatName = checkName(chatName);

    if (chatName === false) {
        return;
    }

    if (logoData !== null) {
        imageToDataURL(logoData, response => {
            const request = {
                chatName,
                userId,
                users,
                data: response
            };

            add(request);
        });
    } else {
        const request = {
            chatName,
            userId,
            users,
            data: null
        };

        add(request);
    }

    function add(request) {
        console.log(request);

        socket.emit("add_chat", request);

        socket.on("add_chat_success", response => {
            console.log("response");

            dispatch(fetchDialogs(socket, getState().user.username));
        });
    }
};

// get users

export const getUsers = socket => dispatch => {
    socket.emit("get_users");

    let connection_on = true;

    socket.on("get_users_success", response => {
        if (connection_on) {
            dispatch(getUsersSuccess(response));

            connection_on = false;
        }
    });
};

export const getUsersSuccess = users => {
    return {
        type: GET_USERS_SUCCESS,
        payload: users
    };
};

// modal

export const showModal = () => {
    return {
        type: SHOW_MODAL
    };
};

export const closeModal = () => {
    return {
        type: CLOSE_MODAL
    };
};

export const setModal = modal => {
    return {
        type: SET_MODAL,
        payload: modal
    };
};
