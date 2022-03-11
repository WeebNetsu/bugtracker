import React, { useState } from 'react';
import Task, { STATUS } from '../../../../models/task';
import { Grid, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import useWindowDimensions from '../../../../utils/window';
import AddIcon from '@mui/icons-material/Add';
import AddTask from '../addTask';
import TaskItem from './components/taskItem';
import { deleteTask, updateTask } from '../../../../api/tasks';
import MessageSnack, { MessageSnackDisplay } from '../../../components/messageSnack';
import ConfirmAlert from '../../../components/confirmAlert';

interface TodoListProps {
    tasks: Task[]
    status: STATUS
    setTasks: any
}

const TaskList: React.FC<TodoListProps> = ({ tasks, status, setTasks }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showDeleteAllAlert, setShowDeleteAllAlert] = useState(false);
    const openAddMenu = Boolean(anchorEl);
    const { height } = useWindowDimensions();
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    const allTasks = tasks.filter(task => {
        if (status === STATUS.COMPLETED) return task.status === STATUS.COMPLETED
        if (status === STATUS.DOING) return task.status === STATUS.DOING
        return task.status === STATUS.TODO
    })

    const handleDeleteAllTasks = async () => {
        try {
            // NOTE: These tasks here! They have been filtered down to the category they are in
            // once the below runs, it will only delete the tasks in THAT category (status)!
            await deleteTask({ tasks: allTasks })
            setTasks((globalTasks: Task[]) => globalTasks.filter((task) => task.status !== status));
        } catch (err: any) {
            setError({
                message: err.toString(),
                show: true,
                error: true
            })
        }
    }

    const handleCardDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const taskId = parseInt(e.dataTransfer.getData("taskId"))
        let moveStatus: STATUS | null = null;

        if (e.currentTarget.className === STATUS.TODO) {
            moveStatus = STATUS.TODO
        } else if (e.currentTarget.className === STATUS.DOING) {
            moveStatus = STATUS.DOING
        } else if (e.currentTarget.className === STATUS.COMPLETED) {
            moveStatus = STATUS.COMPLETED
        }

        if (taskId && moveStatus) {
            try {
                const updatedTask = await updateTask(taskId, { status: moveStatus });

                setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
            } catch (err: any) {
                setError({
                    message: err.toString(),
                    show: true,
                    error: true
                })
            }
        }
    }

    const handleCardDragOver = (e: React.DragEvent<HTMLDivElement>) => { // required for drag/drop to work
        e.preventDefault();
    }

    // const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault();
    //     console.log(e.currentTarget.className)
    //     e.dataTransfer.setData("overStatus", e.currentTarget.className)
    // }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const paperHeight = height * (85 / 100)

    return (
        <div
            onDrop={handleCardDrop}
            onDragOver={handleCardDragOver}
            // onDragEnter={handleDragEnter}
            className={status}
        >
            <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2, minHeight: `400px`, height: `${paperHeight}px`, overflowY: "scroll" }}>
                <Grid container spacing={2}>
                    <Grid item lg={9}>
                        <Typography variant="h3" component="h3" sx={{ textAlign: "center" }}>
                            {status}
                        </Typography>
                    </Grid>

                    <Grid item lg={3}>
                        <Typography variant="h6" component="h3" sx={{ textAlign: "right" }}>
                            <IconButton
                                aria-label="add"
                                id="add-button"
                                onClick={handleClick}
                                aria-controls={openAddMenu ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openAddMenu ? 'true' : undefined}
                            >
                                <AddIcon />
                            </IconButton>
                        </Typography>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openAddMenu}
                            onClose={handleClose}
                            onClick={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'add-button',
                            }}
                        >
                            <MenuItem onClick={() => setShowAddTask(true)}>Add Task</MenuItem>
                            <MenuItem onClick={() => setShowDeleteAllAlert(true)}>Delete All</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>

                {allTasks.map(task => (<TaskItem status={status} setTasks={setTasks} task={task} key={task.id} />))}
            </Paper>

            <AddTask setTasks={setTasks} status={status} setShow={setShowAddTask} show={showAddTask} />

            <MessageSnack message={error} setMessage={setError} />

            <ConfirmAlert show={showDeleteAllAlert} setShow={setShowDeleteAllAlert} desc={`Are you sure you want to delete ALL your tasks in ${status}?`} onConfirm={handleDeleteAllTasks} />
        </div>
    )
}

export default TaskList;