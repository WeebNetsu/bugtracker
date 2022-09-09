import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import {
	Slide,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";

/**
 * Basic slide upwards transition component
 */
const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmAlertProps {
	/**
	 * Text to display in alert
	 */
	desc: string;
	/**
	 * What to do on alert confirm click
	 */
	onConfirm: () => void;
	setShow: (show: boolean) => void;
	/**
	 * If alert should be thrown
	 */
	show: boolean;
}

/**
 * This component is a dialog that will show an alert to the user
 */
const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
	onConfirm,
	desc,
	setShow,
	show,
}) => {
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
				{/* todo shouldn't we change below? */}
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
};

export default ConfirmAlert;
