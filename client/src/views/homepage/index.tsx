import { Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import LoadStatus from '../../models/loadingStatus';
import { STATUS } from '../../models/task';
import { fetchTasks, taskState } from '../../slices/tasks';
import MessageSnack, { MessageSnackDisplay } from '../components/messageSnack';
import TaskList from './components/taskList';

const Homepage: React.FC = () => {
    // const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    const dispatch = useDispatch();

    const { tasks } = useSelector<RootStateOrAny, {
        tasks: taskState
    }>((state) => state);

    useEffect(() => {
        if (tasks.loadingStatus === LoadStatus.NOT_STARTED) {
            dispatch(fetchTasks());
        }
    }, [dispatch, tasks.loadingStatus]);

    useEffect(() => {
        if (tasks.error) {
            setError({
                show: true,
                message: tasks.error,
                error: true
            })
        }
    }, [tasks.error])


    // useEffect(() => {
    //     if(tasks.loadingStatus === LoadStatus.COMPLETE){
    //         setNewTasks();
    //     }
    // }, [tasks.loadingStatus])

    if (tasks.loadingStatus !== LoadStatus.COMPLETE) {
        return (<h1>Loading</h1>);
    }

    // const setNewTasks = async () => {
    //     try {
    //         const tasksFromServer: Task | Task[] = await fetchTasks();

    //         if (Array.isArray(tasksFromServer)) {
    //             setTasks(tasksFromServer ?? [])
    //         }
    //     } catch (err: any) {
    //         setError({
    //             message: err.toString(),
    //             show: true,
    //             error: true
    //         })
    //     }
    // }

    const setTasks = () => {
        console.log("wow")
    }

    const visibleStatuses = [STATUS.TODO, STATUS.DOING, STATUS.COMPLETED]

    return (
        <>
            {/* <Header deleteAllTasks={deleteTask} setHideCompleted={setHideCompleted} hideCompleted={hideCompleted} /> */}

            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    {visibleStatuses.map((status) => (
                        <Grid key={status} item md={4}>
                            <TaskList setTasks={setTasks} tasks={tasks.tasks} status={status} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <MessageSnack message={error} setMessage={setError} />
        </>
    )
}

export default Homepage;