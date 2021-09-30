import { combineReducers, createStore } from "redux";
import creator from "./creator";
import pay from "./pay";
import preview from "./preview";
import user from "./user";

const reducer = combineReducers({
    creator,
    preview,
    pay,
    user,
})

export default reducer

