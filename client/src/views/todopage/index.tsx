import { Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import LoadStatus from '../../models/loadingStatus';
import TaskModel, { STATUS } from '../../models/task';
import { fetchTasks, taskState } from '../../slices/tasks';
import MessageSnack, { MessageSnackDisplay } from '../components/messageSnack';
import TaskList from './components/taskList';

const Todopage: React.FC = () => {
    const [prevStateTasks, setPrevStateTasks] = useState<TaskModel[]>([]);
    const [currentTasks, setCurrentTasks] = useState<TaskModel[]>([]);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    const handleSetCurrentTasks = (tasks: TaskModel[]) => {
        // todo definately improve error handling, this is buggy
        setPrevStateTasks(currentTasks)
        setCurrentTasks(tasks)
    }

    const dispatch = useDispatch();

    const { tasks } = useSelector<RootStateOrAny, {
        tasks: taskState
    }>((state) => state);

    useEffect(() => {
        if (tasks.loadingStatus === LoadStatus.NOT_STARTED) {
            dispatch(fetchTasks());
        }
    });

    useEffect(() => {
        if (tasks.error) {
            setError({
                show: true,
                message: tasks.error,
                error: true
            })

            // restore tasks state (revert any updates)
            setCurrentTasks(prevStateTasks)
        } else {
            handleSetCurrentTasks(tasks.tasks)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks])

    if (tasks.loadingStatus !== LoadStatus.COMPLETE) {
        return (<h1>Loading</h1>);
    }

    const visibleStatuses = [STATUS.TODO, STATUS.DOING, STATUS.COMPLETED]

    return (
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    {visibleStatuses.map((status) => (
                        <Grid key={status} item md={4}>
                            <TaskList tasks={currentTasks} status={status} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <MessageSnack message={error} setMessage={setError} />
        </>
    )
}

export default Todopage;