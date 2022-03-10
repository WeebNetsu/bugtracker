import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import Task, { STATUS } from '../../../../models/task';
import { TransitionProps } from '@mui/material/transitions';

interface AddTaskProps {
    addTask: (task: Task) => void
    show: boolean
    setShow: (x: boolean) => void
    status: STATUS
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddTask: React.FC<AddTaskProps> = ({ addTask, show, setShow, status }) => {
    const taskInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    const handleClose = () => {
        setShow(false);
    };

    function handleSubmit() {
        if (taskInputRef.current) {
            addTask({
                text: taskInputRef.current.value,
                status
            });

            setError('');
            taskInputRef.current.value = ""
        } else {
            setError("No task was entered");
        }
    }

    return (
        <Dialog
            open={show}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Add Task"}</DialogTitle>
            <DialogContent>
                <TextField id="outlined-basic" label="Add new task" inputRef={taskInputRef} variant="outlined" required sx={{ mt: 2 }} />

                <p style={{ color: "red" }}>{error}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddTask;
