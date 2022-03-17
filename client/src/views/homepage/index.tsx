import { Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../../api/tasks';
import Task, { STATUS } from '../../models/task';
import MessageSnack, { MessageSnackDisplay } from '../components/messageSnack';
import TaskList from './components/taskList';

const Homepage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    useEffect(() => {
        setNewTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setNewTasks = async () => {
        try {
            const tasksFromServer: Task | Task[] = await fetchTasks();

            if (Array.isArray(tasksFromServer)) {
                setTasks(tasksFromServer ?? [])
            }
        } catch (err: any) {
            setError({
                message: err.toString(),
                show: true,
                error: true
            })
        }
    }

    const visibleStatuses = [STATUS.TODO, STATUS.DOING, STATUS.COMPLETED]

    return (
        <>
            {/* <Header deleteAllTasks={deleteTask} setHideCompleted={setHideCompleted} hideCompleted={hideCompleted} /> */}

            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    {visibleStatuses.map((status) => (
                        <Grid key={status} item md={4}>
                            <TaskList setTasks={setTasks} tasks={tasks} status={status} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <MessageSnack message={error} setMessage={setError} />
        </>
    )
}

export default Homepage;