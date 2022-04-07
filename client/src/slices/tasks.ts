import { createSlice } from "@reduxjs/toolkit";
import { deleteSelectedTask, getTasks, setTask, updateSelectedTask } from "../api/tasks";
import LoadStatus from "../models/loadingStatus";
import TaskModel, { InsertTaskModel, UpdateTaskModel } from "../models/task";

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
            // NOTE: we do not need this anymore, by not including this
            // we can make the site look faster/smoother than it actually is
            // state.loadingStatus = LoadStatus.PENDING;
        },
        addTasksSuccess(state, action) {
            const task: TaskModel = action.payload;
            state.tasks = [...state.tasks, task];
            // state.loadingStatus = LoadStatus.COMPLETE;
        },
        addTasksFailed(state) {
            // state.loadingStatus = LoadStatus.COMPLETE;
            state.error = "Could not add tasks";
        },
        updateTasksStarted(state) {
            // state.loadingStatus = LoadStatus.PENDING;
        },
        updateTasksSuccess(state, action) {
            const task: TaskModel = action.payload;
            state.tasks = state.tasks.map(tsk => tsk.id === task.id ? task : tsk)
            // state.loadingStatus = LoadStatus.COMPLETE;
        },
        updateTasksFailed(state) {
            // state.loadingStatus = LoadStatus.COMPLETE;
            state.error = "Could not update task";
        },
        deleteTasksStarted(state) {
            // state.loadingStatus = LoadStatus.PENDING;
        },
        deleteTasksSuccess(state, action) {
            const taskId: string = action.payload;
            state.tasks = state.tasks.filter(tsk => tsk.id !== taskId)
            // state.loadingStatus = LoadStatus.COMPLETE;
        },
        deleteTasksFailed(state) {
            // state.loadingStatus = LoadStatus.COMPLETE;
            state.error = "Could not update task";
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
    updateTasksStarted,
    updateTasksSuccess,
    updateTasksFailed,
    deleteTasksStarted,
    deleteTasksSuccess,
    deleteTasksFailed,
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

export const addTask = (task: InsertTaskModel) => async (dispatch: any) => {
    try {
        dispatch(addTasksStarted());
        const tasks = await setTask(task);
        dispatch(addTasksSuccess(tasks.data));
    } catch (err) {
        console.error(err)
        dispatch(addTasksFailed());
    }
};

export const updateTask = (taskId: string, update: UpdateTaskModel) => async (dispatch: any) => {
    try {
        // dispatch(updateTasksStarted()); // todo: for some reason this causes update tasks to not work

        if (taskId.trim().length < 5) {
            throw new Error("Could not find that task, please refreash the page");
        }

        if (!update.status && !update.text) {
            throw new Error("No status or update was passed in.");
        }

        if (update.text && update.text.trim().length < 1) {
            throw new Error("Update text should be valid text");
        }

        const tasks = await updateSelectedTask(taskId, update);
        dispatch(updateTasksSuccess(tasks.data));
    } catch (err) {
        console.error(err)
        dispatch(updateTasksFailed());
    }
};

export const deleteTask = (taskId: string) => async (dispatch: any) => {
    try {
        await deleteSelectedTask({ id: taskId });
        dispatch(deleteTasksSuccess(taskId));
    } catch (err) {
        console.error(err)
        dispatch(updateTasksFailed());
    }
};
