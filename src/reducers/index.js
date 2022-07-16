//This File is to combine all the Reducers that we Formed to a Single Reducer and export it to the State
import {combineReducers} from "redux";
import postReducer from "./postReducer";
import itemsReducer from "./itemsReducer"

//we can also add more reducer in here by importing them above and adding to list below
export default combineReducers({
    post: postReducer,
    item: itemsReducer
})