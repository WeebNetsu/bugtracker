import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MessageSnack, { MessageSnackDisplay } from "../../../../components/MessageSnack";
import { InsertTaskModel, STATUS } from "../../../../models/task";
import { addTask } from "../../../../slices/tasks";
import { getUser } from "../../../../supabase/utils";

interface AddTaskProps {
    show: boolean;
    setShow: (x: boolean) => void;
    status: STATUS;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddTask: React.FC<AddTaskProps> = ({ show, setShow, status }) => {
    const dispatch = useDispatch();

    const taskInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<MessageSnackDisplay>({
        message: "",
        show: false,
        error: true,
    });

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (taskInputRef.current) {
            try {
                const user = await getUser();

                const newTask: InsertTaskModel = {
                    text: taskInputRef.current.value,
                    status,
                    description: descriptionInputRef.current?.value,
                    userId: user.id,
                };

                dispatch(addTask(newTask));

                taskInputRef.current.value = "";

                if (descriptionInputRef.current) {
                    descriptionInputRef.current.value = "";
                }
            } catch (err: any) {
                setError({
                    message: err.toString(),
                    show: true,
                    error: true,
                });
            }
        } else {
            setError({
                message: "No task was entered",
                show: true,
                error: true,
            });
        }
    };

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
                        autoComplete="off"
                    />

                    <TextField
                        label="Description"
                        placeholder="Here I have to do..."
                        multiline
                        fullWidth
                        sx={{ mt: 2 }}
                        inputRef={descriptionInputRef}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Box>

            <MessageSnack message={error} setMessage={setError} />
        </Dialog>
    );
};

export default AddTask;
