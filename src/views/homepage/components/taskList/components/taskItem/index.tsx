import { Paper, Grid, Typography, IconButton, Box, Button, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useRef, useState } from 'react';
import Task, { STATUS } from '../../../../../../models/task';
import { deleteTask, updateTask } from '../../../../../../api/tasks';
import MessageSnack, { MessageSnackDisplay } from '../../../../../components/messageSnack';

interface TaskItemProps {
    task: Task
    setTasks: any
    status: STATUS
}

const TaskItem: React.FC<TaskItemProps> = ({ task, setTasks, status }) => {
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    const taskEditRef = useRef<HTMLInputElement>(null);

    const dragStart = (e: any) => {
        e.dataTransfer.setData('taskId', task.id);
    }

    const dragOver = (e: any) => {
        e.stopPropagation();
    }

    const handleDelete = () => {
        try {
            deleteTask({ id: task.id ?? -1 })
            setTasks((tasks: Task[]) => tasks.filter((tsk) => tsk.id !== task.id));
        } catch (err: any) {
            setError({
                message: err.toString(),
                show: true,
                error: true
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (taskEditRef.current && task.id) {
            try {
                const updatedTask = await updateTask(task.id, {
                    text: taskEditRef.current.value,
                });

                setTasks((tasks: Task[]) => tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
                setEditMode(false);
            } catch (err: any) {
                setError({
                    message: err.toString(),
                    show: true,
                    error: true
                })
            }
        } else {
            setError({
                message: "Updating requires input text.",
                show: true,
                error: true
            })
        }
    }

    return (
        <div
            onDragStart={dragStart}
            onDragOver={dragOver}
            draggable={true}
            onClick={() => !editMode && setEditMode(true)}
        >
            <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2, cursor: "pointer" }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        {editMode ? (
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField id="outlined-basic" autoFocus label="Edit task" defaultValue={task.text} inputRef={taskEditRef} variant="standard" required sx={{ mt: 2 }} />

                                <Button onClick={() => setEditMode(false)} type="button">Cancel</Button>
                                <Button type="submit">Update</Button>
                            </Box>
                        ) : (
                            <Typography variant="h6" component="p">
                                {task.text}
                            </Typography>
                        )}

                    </Grid>

                    <Grid item xs={3} sx={{ textAlign: "right" }}>
                        <IconButton onClick={handleDelete} color="primary" component="span">
                            <HighlightOffIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>

            <MessageSnack message={error} setMessage={setError} />
        </div>
    )
}

export default TaskItem;