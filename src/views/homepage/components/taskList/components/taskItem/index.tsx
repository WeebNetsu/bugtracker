import { Paper, Grid, Typography, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useState } from 'react';
import Task from '../../../../../../models/task';
import { deleteTask } from '../../../../../../api/tasks';
import MessageSnack, { MessageSnackDisplay } from '../../../../../components/messageSnack';

interface TaskItemProps {
    task: Task
    setTasks: any
}

const TaskItem: React.FC<TaskItemProps> = ({ task, setTasks }) => {
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

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

    return (
        <div
            onDragStart={dragStart}
            onDragOver={dragOver}
            draggable={true}
        >
            <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2, cursor: "pointer" }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography variant="h6" component="p">
                            {task.text}
                        </Typography>
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