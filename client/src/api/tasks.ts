import TaskModel, {
	DeleteTasksModel,
	InsertTaskModel,
	UpdateTaskModel,
} from "../models/task";
import { queryURLBuilder } from "../utils";
import axiosConf from "./axios";

const URL = "/tasks";

export interface TaskFetchResponse {
	data: TaskModel | TaskModel[];
}

/**
 * Get single or multiple tasks from the API
 *
 * @param userId ID of user asking for tasks
 * @param id Specific task ID
 * @returns TaskFetchResponse
 */
export const getTasks = async (
	userId: string,
	id?: number
): Promise<TaskFetchResponse> => {
	const url = queryURLBuilder(id ? `${URL}/${id}` : URL, [
		{
			key: "user_id",
			value: userId,
		},
	]);
	console.log(url);

	// send get request to /tasks and retrieve course data from server
	const res = await axiosConf.get(url);

	return res.data;
};

/**
 * Create a new task on API
 *
 * @param task Task data to send to API
 * @returns TaskFetchResponse
 */
export const setTask = async (
	task: InsertTaskModel
): Promise<TaskFetchResponse> => {
	// send get request to /tasks and retrieve course data from server
	if (!task.text?.trim()) throw new Error("No task text");
	const res = await axiosConf.post(URL, task);

	return res.data;
};

/**
 * Update a task on the API
 *
 * @param taskId ID of task to update
 * @param update Updated data to apply to task
 * @returns TaskFetchResponse
 */
export const updateSelectedTask = async (
	taskId: number,
	update: UpdateTaskModel
): Promise<TaskFetchResponse> => {
	const res = await axiosConf.put(`${URL}/${taskId}`, update);
	return res.data;
};

/**
 * Will delete a task on the API
 *
 * @param id ID of task to delete
 * @param userId ID of user trying to delete task
 */
export async function deleteTask(id: number, userId: string): Promise<void> {
	try {
		const url = queryURLBuilder(`${URL}/${id}`, [
			{
				key: "user_id",
				value: userId,
			},
		]);

		await axiosConf.delete(url);
	} catch (err) {
		console.error(err);
		throw new Error("Could not delete task(s)");
	}
}

/**
 * Delete multiple tasks at once
 *
 * @param selection Selection of tasks to delete
 */
export async function deleteTasks(selection: DeleteTasksModel): Promise<void> {
	try {
		// todo below is not scaleable, tweak to build url better
		await axiosConf.delete(`${URL}?status=${selection.status}`);
	} catch (err) {
		console.error(err);
		throw new Error("Could not delete task(s)");
	}
}
