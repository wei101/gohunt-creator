import { combineReducers, createStore } from "redux";
import creator from "./creator";
import pay from "./pay";
import preview from "./preview";

const reducer = combineReducers({
    creator,
    preview,
    pay,
})

export default reducer

