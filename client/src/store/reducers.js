import { combineReducers } from "redux";
import { reducerUser, reducerApp } from "./Chat/reducer";

export default combineReducers({ user: reducerUser, app: reducerApp });
