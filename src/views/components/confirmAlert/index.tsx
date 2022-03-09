import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { Slide, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmAlertProps {
    desc: string
    onConfirm: () => void
    setShow: (show: boolean) => void
    show: boolean
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({ onConfirm, desc, setShow, show }) => {
    const handleClose = () => {
        setShow(false);
    };

    function handleConfirm(e: React.FormEvent) {
        e.preventDefault();

        onConfirm();
        handleClose();
    }

    return (
        <div>
            <Dialog
                open={show}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {desc}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ConfirmAlert;
