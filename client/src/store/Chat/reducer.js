import {
    FETCH_LOGIN_SUCCESS,
    LOGIN_INTERFACE,
    LOGOUT_INTERFACE,
    FETCH_DIALOGS_SUCCESS,
    TOGGLE_ACTIVE_DIALOG,
    SET_SEARCH_WORD,
    GET_USERS_SUCCESS,
    FETCH_DIALOG_SUCCESS,
    SHOW_MODAL,
    CLOSE_MODAL,
    SET_MODAL
} from "./actions";

const initialState = {
    app: {
        searchWord: null,
        state: "logout",
        dialogs: {
            currentDialog: null,
            list: []
        },
        users: [],
        modal: {
            show: false,
            content: null
        }
    },
    user: {
        username: null,
        userid: null,
        logoSrc: null
    }
};

export function reducerUser(state = initialState.user, action) {
    switch (action.type) {
        case FETCH_LOGIN_SUCCESS: {
            return {
                ...state,
                username: action.payload.username,
                userid: action.payload.userid,
                logoSrc: action.payload.logoSrc
            };
        }
        case LOGOUT_INTERFACE: {
            return {
                username: null,
                userid: null,
                logoSrc: null
            };
        }
        default: {
            return state;
        }
    }
}

export function reducerApp(state = initialState.app, action) {
    switch (action.type) {
        case LOGIN_INTERFACE: {
            return { ...state, state: "login" };
        }
        case LOGOUT_INTERFACE: {
            return {
                searchWord: null,
                state: "logout",
                dialogs: {
                    currentDialog: null,
                    list: []
                },
                users: [],
                modal: {
                    show: false,
                    content: null
                }
            };
        }
        case FETCH_DIALOGS_SUCCESS: {
            return {
                ...state,
                dialogs: {
                    ...state.dialogs,
                    list: action.payload
                }
            };
        }
        case FETCH_DIALOG_SUCCESS: {
            return {
                ...state,
                dialogs: {
                    ...state.dialogs,
                    list: {
                        ...state.dialogs.list,
                        [action.payload.chatId]: {
                            ...action.payload
                        }
                    }
                }
            };
        }
        case TOGGLE_ACTIVE_DIALOG: {
            return {
                ...state,
                dialogs: {
                    ...state.dialogs,
                    currentDialog: action.payload
                }
            };
        }
        case SET_SEARCH_WORD: {
            return {
                ...state,
                searchWord: action.payload
            };
        }
        case GET_USERS_SUCCESS: {
            return {
                ...state,
                users: action.payload
            };
        }
        case SHOW_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    show: true
                }
            };
        }
        case CLOSE_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    show: false
                }
            };
        }
        case SET_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    content: action.payload
                }
            };
        }
        default: {
            return state;
        }
    }
}
