import React from 'react';
import Task, { STATUS } from '../../../../models/task';
import { Button, Checkbox, FormControlLabel, Grid, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import useWindowDimensions from '../../../../utils/window';
import AddIcon from '@mui/icons-material/Add';

interface TodoListProps {
    tasks: Task[]
    deleteTask: (id: number) => void
    checkTask: (id: number) => void
    hideCompleted: boolean
    status: STATUS
}

const TaskList: React.FC<TodoListProps> = ({ tasks, deleteTask, checkTask, hideCompleted, status }) => {


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };




    // const allTasks = tasks.filter(task => hideCompleted ? !task.checked : true)
    const allTasks = tasks.filter(task => {
        if (status === STATUS.COMPLETED) return task.status === STATUS.COMPLETED
        if (status === STATUS.DOING) return task.status === STATUS.DOING
        return task.status === STATUS.TODO
    })

    const { height } = useWindowDimensions();

    const paperHeight = height * (70 / 100)

    return (
        <>

            <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2, minHeight: `${paperHeight}px` }}>
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
                                onClick={handleClick}
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <AddIcon />
                            </IconButton>
                        </Typography>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}>Add Task</MenuItem>
                            <MenuItem onClick={handleClose}>Delete All</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>

                {allTasks.map(task => (
                    <Paper elevation={3} key={task.id} sx={{ mt: 2, mb: 2, p: 2, cursor: "pointer" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={8} onClick={() => checkTask(task.id ?? -1)}>
                                <Typography variant="h6" component="p">
                                    {task.text}
                                </Typography>
                                {/* <FormControlLabel control={<Checkbox checked={!!task.checked} />} label={task.text} /> */}
                            </Grid>

                            <Grid item xs={3} sx={{ textAlign: "right" }}>
                                <IconButton onClick={() => deleteTask(task.id ?? -1)} color="primary" component="span">
                                    <HighlightOffIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Paper>
        </>
    )
}

export default TaskList;