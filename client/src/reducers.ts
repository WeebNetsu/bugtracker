import { combineReducers } from "redux";
import authSlice from "./slices/auth";
import tasksSlice from "./slices/tasks";

// all slices goes here, will be passed into store and used through while app
const rootReducer = combineReducers({
    tasks: tasksSlice,
    auth: authSlice,
});

export default rootReducer;
