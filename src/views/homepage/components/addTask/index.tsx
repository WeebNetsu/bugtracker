import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { STATUS } from '../../../../models/task';
import { TransitionProps } from '@mui/material/transitions';
import MessageSnack, { MessageSnackDisplay } from '../../../components/messageSnack';
import { addTask } from '../../../../api/tasks';
import Task from '../../../../models/task';

interface AddTaskProps {
    show: boolean
    setShow: (x: boolean) => void
    status: STATUS
    setTasks: any
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddTask: React.FC<AddTaskProps> = ({ show, setShow, status, setTasks }) => {
    const taskInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    const handleClose = () => {
        setShow(false);
    };

    const handleAddTask = async () => {
        if (taskInputRef.current) {
            try {
                const newTask = await addTask({
                    text: taskInputRef.current.value,
                    status
                });

                taskInputRef.current.value = ""
                setTasks((tasks: Task[]) => [...tasks, newTask]); // server automatically added an id
            } catch (err: any) {
                setError({
                    message: err.toString(),
                    show: true,
                    error: true
                })
            }
        } else {
            setError({
                message: "No task was entered",
                show: true,
                error: true
            })
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddTask}>Add</Button>
            </DialogActions>

            <MessageSnack message={error} setMessage={setError} />
        </Dialog>
    );
}

export default AddTask;
