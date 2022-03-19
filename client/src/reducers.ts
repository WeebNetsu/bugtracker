import { combineReducers } from 'redux';
import tasksSlice from './slices/tasks';

// all slices goes here, will be passed into store and used through while app
const rootReducer = combineReducers({
    tasks: tasksSlice,
});

export default rootReducer;
