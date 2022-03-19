import { createSlice } from "@reduxjs/toolkit";
import { getTasks } from "../api/tasks";
import LoadStatus from "../models/loadingStatus";
import TaskModel from "../models/task";

export interface taskState {
    loadingStatus: LoadStatus;
    tasks: TaskModel[];
    error: string;
}

const initialState: taskState = {
    loadingStatus: LoadStatus.NOT_STARTED,
    tasks: [],
    error: "",
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        getTasksStarted(state) {
            state.loadingStatus = LoadStatus.PENDING;
        },
        getTasksSuccess(state, action) {
            const tasks = action.payload;
            state.tasks = tasks.data;
            state.loadingStatus = LoadStatus.COMPLETE;
        },
        getTasksFailed(state) {
            state.loadingStatus = LoadStatus.COMPLETE;
            state.error = "Could not get tasks";
        },
    },
});

export const {
    getTasksStarted,
    getTasksSuccess,
    getTasksFailed
} = tasksSlice.actions;

export default tasksSlice.reducer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTasks = () => async (dispatch: any) => {
    try {
        dispatch(getTasksStarted());
        const tasks = await getTasks();
        dispatch(getTasksSuccess(tasks.data));
    } catch (err) {
        console.error(err)
        dispatch(getTasksFailed());
    }
};
