import { Paper, Grid, Typography, IconButton, Box, Button, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useEffect, useRef, useState } from 'react';
import Task from '../../../../../../models/task';
import MessageSnack, { MessageSnackDisplay } from '../../../../../components/messageSnack';
import { useDispatch } from 'react-redux';
import LoadStatus from '../../../../../../models/loadingStatus';
import { fetchTasks, taskState, updateTask } from '../../../../../../slices/tasks';

interface TaskItemProps {
    task: Task
    tasksSelector: taskState
}

const TaskItem: React.FC<TaskItemProps> = ({ task, tasksSelector }) => {
    const dispatch = useDispatch();

    const [refreshTasks, setRefreshTasks] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    const taskEditRef = useRef<HTMLInputElement>(null);
    const commentEditRef = useRef<HTMLInputElement>(null);

    const dragStart = (e: any) => {
        e.dataTransfer.setData('taskId', task.id);
    }

    const dragOver = (e: any) => {
        e.stopPropagation();
    }

    useEffect(() => {
        if (refreshTasks && tasksSelector.loadingStatus === LoadStatus.COMPLETE) {
            dispatch(fetchTasks());
            setRefreshTasks(false);
        }
    }, [dispatch, tasksSelector, refreshTasks]);

    const handleDelete = () => {
        try {
            // deleteTask({ id: task.id ?? -1 })
            // setTasks((tasks: Task[]) => tasks.filter((tsk) => tsk.id !== task.id));
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
        e.stopPropagation()
        if (taskEditRef.current && task.id) {
            try {
                if (!task.id) {
                    setError({
                        message: "This task has no ID",
                        show: true,
                        error: true
                    })
                    return
                }

                dispatch(updateTask(task.id, {
                    text: taskEditRef.current.value,
                    comment: commentEditRef.current?.value
                }))

                setRefreshTasks(true); // todo not working
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
                                <TextField
                                    autoFocus
                                    label="Edit Task"
                                    defaultValue={task.text}
                                    inputRef={taskEditRef}
                                    variant="standard"
                                    required
                                    sx={{ mt: 2 }}
                                    autoComplete='off'
                                />

                                <TextField
                                    label="Edit Description"
                                    defaultValue={task.comment}
                                    variant="standard"
                                    multiline
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    inputRef={commentEditRef}
                                    autoComplete='off'
                                />

                                <Button onClick={() => setEditMode(false)} type="button">Cancel</Button>
                                <Button type="submit">Update</Button>
                            </Box>
                        ) : (
                            <>
                                <Typography variant="h6" component="p">
                                    {task.text}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {task.comment}
                                </Typography>
                            </>
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