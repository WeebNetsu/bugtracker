import { combineReducers } from "redux";
import tasksSlice from "./slices/tasks";
import authSlice from "./slices/auth";

// all slices goes here, will be passed into store and used through while app
const rootReducer = combineReducers({
	tasks: tasksSlice,
	auth: authSlice,
});

export default rootReducer;
