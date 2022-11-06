import { Backdrop, CircularProgress, Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MessageSnack, { MessageSnackDisplay } from "../../components/MessageSnack";
import Navigation from "../../components/Navigation";
import LoadStatus from "../../models/loadingStatus";
import TaskModel, { STATUS } from "../../models/task";
import { fetchTasks, taskState } from "../../slices/tasks";
import { getLoggedIn, getUser } from "../../supabase/utils";
import TaskList from "./components/TaskList";

const TodoPage: React.FC = () => {
    const [prevStateTasks, setPrevStateTasks] = useState<TaskModel[]>([]);
    const [currentTasks, setCurrentTasks] = useState<TaskModel[]>([]);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true,
    });
    const navigate = useNavigate();

    const handleSetCurrentTasks = (tasks: TaskModel[]) => {
        // todo definitely improve error handling, this is buggy
        setPrevStateTasks(currentTasks);
        setCurrentTasks(tasks);
    };

    const dispatch = useDispatch();

    const { tasks } = useSelector<
        RootStateOrAny,
        {
            tasks: taskState;
        }
    >(state => state);

    useEffect(() => {
        const run = async () => {
            const loggedIn = await getLoggedIn();

            if (!loggedIn) {
                navigate("/login");
            }

            try {
                const user = await getUser();

                if (tasks.loadingStatus === LoadStatus.NOT_STARTED) {
                    dispatch(fetchTasks(user.id));
                }
            } catch (err: any) {
                setError({
                    show: true,
                    message: err.toString(),
                    error: true,
                });
            }
        };

        run();
    });

    useEffect(() => {
        if (tasks.error) {
            setError({
                show: true,
                message: tasks.error,
                error: true,
            });

            // restore tasks state (revert any updates)
            setCurrentTasks(prevStateTasks);
        } else {
            handleSetCurrentTasks(tasks.tasks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks]);

    const visibleStatuses = [STATUS.TODO, STATUS.DOING, STATUS.COMPLETED];

    return (
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    {visibleStatuses.map(status => (
                        <Grid key={status} item md={4}>
                            <TaskList tasks={currentTasks} status={status} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Navigation />

            <MessageSnack message={error} setMessage={setError} />

            <Backdrop open={tasks.loadingStatus !== LoadStatus.COMPLETE}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default TodoPage;
