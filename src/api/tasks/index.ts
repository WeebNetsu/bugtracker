import Task, { STATUS } from "../../models/task";

export async function fetchTasks(id?: number): Promise<Task | Task[]> {
    try {
        const res = id ? await fetch(`http://localhost:5000/tasks/${id}`) : await fetch("http://localhost:5000/tasks");
        const data: Task | Task[] = await res.json();

        return data;
    } catch (err) {
        console.error(err)
        throw new Error("Could not get tasks (server error)")
    }
}


export async function addTask(task: Task): Promise<Task> {
    try {
        if (!task.text?.trim()) throw new Error("No task text")

        const res = await fetch(`http://localhost:5000/tasks`, {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify(task)
        })

        const newTask: Task = await res.json();

        return newTask;
    } catch (error) {
        console.error(error)
        throw new Error("Could not add task.")
    }
}

export async function deleteTask(item: { id?: number, tasks?: Task[] }): Promise<void> {
    try {
        if (item.id) {
            if (item.id < 0) throw new Error("Id is undefined (less than 0)");

            await fetch(`http://localhost:5000/tasks/${item.id}`, {
                "method": "DELETE"// sends a requiest to the server to delete the data
            })
        } else if (item.tasks) {
            const toBeDeleted = item.tasks.map(async (task) => {
                return await fetch(`http://localhost:5000/tasks/${task.id}`, {
                    "method": "DELETE" // sends a requiest to the server to delete the data
                })
            })

            await Promise.all(toBeDeleted)
        } else {
            throw new Error("No ID or tasks were given.");
        }
    } catch (err) {
        console.error(err)
        throw new Error("Could not delete task(s)")
    }
}

export async function moveTask(id: number, status: STATUS): Promise<Task> {
    if (id < 0) {
        throw new Error("Could not find that task, please refreash the page");
    }

    try {
        const task = await fetchTasks(id);
        const updatedTask = { ...task, status: status };

        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            "method": "PUT",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify(updatedTask)
        })

        const data: Task = await res.json();
        return data;
    } catch (err) {
        console.error(err)
        throw new Error("Could not update task (server error)")
    }
}