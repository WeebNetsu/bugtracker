import { createSlice } from "@reduxjs/toolkit";
import {
	deleteTask,
	deleteTasks,
	getTasks,
	setTask,
	updateSelectedTask,
} from "../api/tasks";
import LoadStatus from "../models/loadingStatus";
import TaskModel, {
	DeleteTasksModel,
	InsertTaskModel,
	UpdateTaskModel,
} from "../models/task";

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
		addTaskStarted(state) {
			// NOTE: we do not need this anymore, by not including this
			// we can make the site look faster/smoother than it actually is
			// state.loadingStatus = LoadStatus.PENDING;
		},
		addTaskSuccess(state, action) {
			const task: TaskModel = action.payload;
			state.tasks = [...state.tasks, task];
			// state.loadingStatus = LoadStatus.COMPLETE;
		},
		addTaskFailed(state) {
			// state.loadingStatus = LoadStatus.COMPLETE;
			state.error = "Could not add tasks";
		},
		updateTaskSuccess(state, action) {
			const task: TaskModel = action.payload;
			state.tasks = state.tasks.map((tsk) => (tsk.id === task.id ? task : tsk));
			// state.loadingStatus = LoadStatus.COMPLETE;
		},
		updateTaskFailed(state) {
			// state.loadingStatus = LoadStatus.COMPLETE;
			state.error = "Could not update task";
		},
		deleteTaskSuccess(state, action) {
			const taskId: number = action.payload;
			state.tasks = state.tasks.filter((tsk) => tsk.id !== taskId);
			// state.loadingStatus = LoadStatus.COMPLETE;
		},
		deleteTaskFailed(state) {
			// state.loadingStatus = LoadStatus.COMPLETE;
			state.error = "Could not update task";
		},
		deleteTasksStarted(state) {
			state.loadingStatus = LoadStatus.PENDING;
		},
		deleteTasksSuccess(state, action) {
			const deletedTasksStatus: DeleteTasksModel = action.payload;
			// todo once we scale up, well have to change this
			state.tasks = state.tasks.filter(
				(tsk) => tsk.status !== deletedTasksStatus.status
			);
			state.loadingStatus = LoadStatus.COMPLETE;
		},
		deleteTasksFailed(state) {
			state.loadingStatus = LoadStatus.COMPLETE;
			state.error = "Could not update task";
		},
	},
});

export const {
	getTasksStarted,
	getTasksSuccess,
	getTasksFailed,
	addTaskStarted,
	addTaskSuccess,
	addTaskFailed,
	updateTaskSuccess,
	updateTaskFailed,
	deleteTaskSuccess,
	deleteTaskFailed,
	deleteTasksStarted,
	deleteTasksSuccess,
	deleteTasksFailed,
} = tasksSlice.actions;

export default tasksSlice.reducer;

export const fetchTasks = (userId: string) => async (dispatch: any) => {
	try {
		dispatch(getTasksStarted());
		const tasks = await getTasks(userId);
		dispatch(getTasksSuccess(tasks.data));
	} catch (err) {
		console.error(err);
		dispatch(getTasksFailed());
	}
};

export const addTask = (task: InsertTaskModel) => async (dispatch: any) => {
	try {
		dispatch(addTaskStarted());
		const tasks = await setTask(task);
		dispatch(addTaskSuccess(tasks.data));
	} catch (err) {
		console.error(err);
		dispatch(addTaskFailed());
	}
};

export const updateTask =
	(taskId: number, update: UpdateTaskModel) => async (dispatch: any) => {
		try {
			// dispatch(updateTaskStarted()); // todo: for some reason this causes update tasks to not work

			if (taskId < 1) {
				throw new Error("Could not find that task, please refreash the page");
			}

			if (!update.status && !update.text) {
				throw new Error("No status or update was passed in.");
			}

			if (update.text && update.text.trim().length < 1) {
				throw new Error("Update text should be valid text");
			}

			console.log("UPDATED TASK", update);
			const tasks = await updateSelectedTask(taskId, update);
			dispatch(updateTaskSuccess(tasks.data));
		} catch (err) {
			console.error(err);
			dispatch(updateTaskFailed());
		}
	};

export const deleteSelectedTask = (taskId: number) => async (dispatch: any) => {
	try {
		await deleteTask(taskId);
		dispatch(deleteTaskSuccess(taskId));
	} catch (err) {
		console.error(err);
		dispatch(updateTaskFailed());
	}
};

export const deleteSelectedTasks =
	(selection: DeleteTasksModel) => async (dispatch: any) => {
		try {
			dispatch(deleteTasksStarted());
			await deleteTasks(selection);
			dispatch(deleteTasksSuccess(selection));
		} catch (err) {
			console.error(err);
			dispatch(deleteTasksFailed());
		}
	};
