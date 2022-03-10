import React, { useState } from 'react';
import Task, { STATUS } from '../../../../models/task';
import { Grid, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import useWindowDimensions from '../../../../utils/window';
import AddIcon from '@mui/icons-material/Add';
import AddTask from '../addTask';
import TaskItem from './components/taskItem';

interface TodoListProps {
    tasks: Task[]
    deleteTask: (id: number) => void
    checkTask: (id: number) => void
    addTask: (task: Task) => void
    status: STATUS
}

const TaskList: React.FC<TodoListProps> = ({ tasks, deleteTask, checkTask, addTask, status }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const openAddMenu = Boolean(anchorEl);
    const { height } = useWindowDimensions();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const allTasks = tasks.filter(task => {
        if (status === STATUS.COMPLETED) return task.status === STATUS.COMPLETED
        if (status === STATUS.DOING) return task.status === STATUS.DOING
        return task.status === STATUS.TODO
    })

    const paperHeight = height * (85 / 100)

    return (
        <>
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
                            <MenuItem onClick={handleClose}>Delete All</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>

                {allTasks.map(task => (<TaskItem deleteTask={deleteTask} status={status} task={task} key={task.id} />))}
            </Paper>

            <AddTask status={status} addTask={addTask} setShow={setShowAddTask} show={showAddTask} />
        </>
    )
}

export default TaskList;