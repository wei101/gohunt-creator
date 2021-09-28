import { combineReducers, createStore } from "redux";
import creator from "./creator";
import preview from "./preview";

const reducer = combineReducers({
    creator,
    preview,
})

export default reducer

