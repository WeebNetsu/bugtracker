import { createSlice } from "@reduxjs/toolkit";
import { getTasks, setTask } from "../api/tasks";
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
            state.tasks = tasks;
            state.loadingStatus = LoadStatus.COMPLETE;
        },
        getTasksFailed(state) {
            state.loadingStatus = LoadStatus.COMPLETE;
            state.error = "Could not get tasks";
        },
        addTasksStarted(state) {
            state.loadingStatus = LoadStatus.PENDING;
        },
        addTasksSuccess(state, action) {
            const task: TaskModel = action.payload;
            state.tasks = [...state.tasks, task];
            state.loadingStatus = LoadStatus.COMPLETE;
        },
        addTasksFailed(state) {
            state.loadingStatus = LoadStatus.COMPLETE;
            state.error = "Could not add tasks";
        },
    },
});

export const {
    getTasksStarted,
    getTasksSuccess,
    getTasksFailed,
    addTasksStarted,
    addTasksSuccess,
    addTasksFailed,
} = tasksSlice.actions;

export default tasksSlice.reducer;

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

export const addTask = (task: TaskModel) => async (dispatch: any) => {
    try {
        dispatch(addTasksStarted());
        const tasks = await setTask(task);
        dispatch(addTasksSuccess(tasks.data));
    } catch (err) {
        console.error(err)
        dispatch(addTasksFailed());
    }
};
