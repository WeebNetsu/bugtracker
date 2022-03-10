import { Paper, Grid, Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useEffect, useState } from 'react';
import Task, { STATUS } from '../../../../../../models/task';

interface TaskItemProps {
    task: Task
    status: STATUS
    deleteTask: (taskId: number) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, status, deleteTask }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [availableMoves, setAvailableMoves] = useState<STATUS[]>([STATUS.DOING, STATUS.COMPLETED]); // default = todo
    const openMoveMenu = Boolean(anchorEl);

    useEffect(() => {
        if (status === STATUS.COMPLETED) {
            setAvailableMoves([STATUS.TODO, STATUS.DOING])
        } else if (status === STATUS.DOING) {
            setAvailableMoves([STATUS.TODO, STATUS.COMPLETED])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper elevation={3} sx={{ mt: 2, mb: 2, p: 2, cursor: "pointer" }}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Box
                        component="span"
                        id="move-button"
                        onClick={handleClick}
                        aria-label="move"
                        aria-controls={openMoveMenu ? 'basic-move-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMoveMenu ? 'true' : undefined}
                    >
                        <Typography variant="h6" component="p">
                            {task.text}
                        </Typography>
                    </Box>

                </Grid>

                <Menu
                    id="basic-move-menu"
                    anchorEl={anchorEl}
                    open={openMoveMenu}
                    onClose={handleClose}
                    onClick={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'move-button',
                    }}
                >
                    {availableMoves.map(move => (
                        <MenuItem onClick={handleClose} key={move}>{move}</MenuItem>
                    ))}
                </Menu>

                <Grid item xs={3} sx={{ textAlign: "right" }}>
                    <IconButton onClick={() => deleteTask(task.id ?? -1)} color="primary" component="span">
                        <HighlightOffIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default TaskItem;