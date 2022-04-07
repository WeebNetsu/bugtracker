import TaskModel, { InsertTaskModel, UpdateTaskModel } from "../models/task";
import axiosConf from "./axios";

const TASKS_URL = "/tasks/";

export interface TaskFetchResponse {
    data: TaskModel | TaskModel[]
}

export const getTasks = async (id?: string): Promise<TaskFetchResponse> => {
    // send get request to /tasks and retrieve course data from server
    const res = id ? await axiosConf.get(`${TASKS_URL}${id}`) : await axiosConf.get(TASKS_URL);

    return res.data;
};

export const setTask = async (task: InsertTaskModel): Promise<TaskFetchResponse> => {
    // send get request to /tasks and retrieve course data from server
    if (!task.text?.trim()) throw new Error("No task text")
    const res = await axiosConf.post(TASKS_URL, task);

    return res.data;
};

export async function deleteSelectedTask(item: { id?: string, tasks?: TaskModel[] }): Promise<void> {
    try {
        if (item.id) { // delete 1 task
            await axiosConf.delete(`${TASKS_URL}${item.id}`);
        } else if (item.tasks) { // todo: delete multiple tasks
            // const toBeDeleted = item.tasks.map(async (task) => {
            //     return await fetch(`${TASKS_URL}/${task.id}`, {
            //         "method": "DELETE" // sends a requiest to the server to delete the data
            //     })
            // })

            // await Promise.all(toBeDeleted)
        } else {
            throw new Error("No ID or tasks were given.");
        }
    } catch (err) {
        console.error(err)
        throw new Error("Could not delete task(s)")
    }
}

export const updateSelectedTask = async (taskId: string, update: UpdateTaskModel): Promise<TaskFetchResponse> => {
    // send get request to /tasks and retrieve course data from server
    const res = await axiosConf.put(TASKS_URL + taskId, update);
    return res.data;
};

// export async function updateTask(taskId: number, update: { status?: STATUS, text?: string, comment?: string }): Promise<TaskModel> {
//     if (taskId < 0) {
//         throw new Error("Could not find that task, please refreash the page");
//     }

//     if (!update.status && !update.text) {
//         throw new Error("No status or update was passed in.");
//     }

//     if (update.text && update.text.trim().length < 1) {
//         throw new Error("Update text should be valid text");
//     }

//     try {
//         const task = await getTasks(taskId);
//         const updatedTask = { ...task, ...update };

//         const res = await fetch(`${TASKS_URL}/${taskId}`, {
//             "method": "PUT",
//             "headers": {
//                 "content-type": "application/json"
//             },
//             "body": JSON.stringify(updatedTask)
//         })

//         const data: TaskModel = await res.json();
//         return data;
//     } catch (err) {
//         console.error(err)
//         throw new Error("Could not update task (server error)")
//     }
// }