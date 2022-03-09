import { Box, IconButton, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import Task from '../../../../models/task';
import AddIcon from '@mui/icons-material/Add';

interface AddTaskProps {
    addTask: (task: Task) => void
}

const AddTask: React.FC<AddTaskProps> = ({ addTask }) => {
    const taskInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (taskInputRef.current) {
            addTask({
                text: taskInputRef.current.value,
                checked: false
            });

            setError('');
            taskInputRef.current.value = ""
        } else {
            setError("No task was entered");
        }
    }

    return (
        <Box component={"form"} sx={{ textAlign: "center", mt: 3 }} onSubmit={handleSubmit}>
            <TextField id="outlined-basic" label="Add new task" inputRef={taskInputRef} variant="outlined" required sx={{ mr: 2 }} />
            {/* <Button variant='contained' type='submit'>Add Task</Button> */}
            <IconButton aria-label="add" type='submit'>
                <AddIcon />
            </IconButton>

            <p style={{ color: "red" }}>{error}</p>
        </Box>
    )
}

export default AddTask;