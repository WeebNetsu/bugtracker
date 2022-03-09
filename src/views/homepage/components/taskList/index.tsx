import React from 'react';
import Task from '../../../../models/task';
import { Checkbox, FormControlLabel, Grid, IconButton, Paper } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface TodoListProps {
    tasks: Task[]
    deleteTask: (id: number) => void
    checkTask: (id: number) => void
    hideCompleted: boolean
}

const TaskList: React.FC<TodoListProps> = ({ tasks, deleteTask, checkTask, hideCompleted }) => {
    const allTasks = tasks.filter(task => hideCompleted ? !task.checked : true)

    return (
        <>
            {allTasks.map(task => {
                return (
                    <Paper elevation={3} key={task.id} sx={{ mt: 2, mb: 2, p: 2, cursor: "pointer" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={8} onClick={() => checkTask(task.id ?? -1)}>
                                <FormControlLabel control={<Checkbox checked={!!task.checked} />} label={task.text} />
                            </Grid>

                            <Grid item xs={3} sx={{ textAlign: "right" }}>
                                <IconButton onClick={() => deleteTask(task.id ?? -1)} color="primary" component="span">
                                    <HighlightOffIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}

        </>
    )
}

export default TaskList;