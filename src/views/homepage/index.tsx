import { Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Task, { STATUS } from '../../models/task';
import AddTask from './components/addTask';
import Header from './components/header';
import TaskList from './components/taskList';

const Homepage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState("");
    const [hideCompleted, setHideCompleted] = useState(false);

    useEffect(() => {
        setNewTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchTasks = async (id?: number) => {
        try {
            const res = id ? await fetch(`http://localhost:5000/tasks/${id}`) : await fetch("http://localhost:5000/tasks");
            const data = await res.json();

            setError("")
            return data;
        } catch (err) {
            console.error(err)
            setError("Could not get tasks (server error)")
            return []
        }
    }

    const setNewTasks = async () => {
        const tasksFromServer: Task[] = await fetchTasks();
        setTasks(tasksFromServer ?? [])
    }

    async function addTask(task: Task) {
        try {
            if (!task.text?.trim()) throw new Error("No task text")

            const res = await fetch(`http://localhost:5000/tasks`, {
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "body": JSON.stringify(task)
            })

            const newTask = await res.json();

            setTasks(tasks => [...tasks, newTask]); // server automatically added an id
            setError("")
        } catch (error) {
            console.error(error)
            setError("Could not add task.")
        }
    }

    async function deleteTask(id?: number) {
        try {
            if (id) {
                if (id < 0) throw new Error("Id is undefined (less than 0)");

                await fetch(`http://localhost:5000/tasks/${id}`, {
                    "method": "DELETE"// sends a requiest to the server to delete the data
                })

                setTasks(tasks.filter(task => task.id !== id));
            } else {
                const toBeDeleted = tasks.map(async (task) => {
                    return await fetch(`http://localhost:5000/tasks/${task.id}`, {
                        "method": "DELETE" // sends a requiest to the server to delete the data
                    })
                })

                await Promise.all(toBeDeleted)

                setTasks([]);
            }
        } catch (err) {
            console.error(err)
            setError("Could not delete task(s)")
        }
    }

    async function checkTask(id: number) {
        if (id < 0) {
            setError("Could not find that task, please refreash the page")
            return;
        }

        try {
            const task = await fetchTasks(id);
            const updatedTask = { ...task, checked: !task.checked };

            const res = await fetch(`http://localhost:5000/tasks/${id}`, {
                "method": "PUT",
                "headers": {
                    "content-type": "application/json"
                },
                "body": JSON.stringify(updatedTask)
            })

            const data = await res.json();

            setTasks(tasks.map(task => task.id === id ? { ...task, checked: data.checked } : task))
            setError('')
        } catch (err) {
            console.error(err)
            setError("Could not update task (server error)")
        }
    }

    return (
        <>
            {/* <Header deleteAllTasks={deleteTask} setHideCompleted={setHideCompleted} hideCompleted={hideCompleted} /> */}

            <Container maxWidth="xl">
                <p style={{ color: "red" }}>{error}</p>

                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <TaskList hideCompleted={hideCompleted} tasks={tasks} deleteTask={deleteTask} checkTask={checkTask} status={STATUS.TODO} />
                    </Grid>
                    <Grid item md={4}>
                        <TaskList hideCompleted={hideCompleted} tasks={tasks} deleteTask={deleteTask} checkTask={checkTask} status={STATUS.DOING} />
                    </Grid>
                    <Grid item md={4}>
                        <TaskList hideCompleted={hideCompleted} tasks={tasks} deleteTask={deleteTask} checkTask={checkTask} status={STATUS.COMPLETED} />
                    </Grid>
                </Grid>

                <AddTask addTask={addTask} />
            </Container>
        </>
    )
}

export default Homepage;