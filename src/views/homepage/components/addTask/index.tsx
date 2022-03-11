import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from '@mui/material';
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
    const commentInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true
    });

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (taskInputRef.current) {
            try {
                const newTask = await addTask({
                    text: taskInputRef.current.value,
                    status,
                    comment: commentInputRef.current?.value
                });

                taskInputRef.current.value = ""

                if (commentInputRef.current) {
                    commentInputRef.current.value = ""
                }

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
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>{"Add Task"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Add new task"
                        inputRef={taskInputRef}
                        variant="outlined"
                        required
                        placeholder="Refactor the HTML"
                        fullWidth
                        sx={{ mt: 2 }}
                    />

                    <TextField
                        label="Description"
                        placeholder="Here I have to do..."
                        multiline
                        fullWidth
                        sx={{ mt: 2 }}
                        inputRef={commentInputRef}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} type="button">Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Box>

            <MessageSnack message={error} setMessage={setError} />
        </Dialog>
    );
}

export default AddTask;
