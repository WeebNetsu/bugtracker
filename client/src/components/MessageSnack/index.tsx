import React from "react";
import { Snackbar, Alert, IconButton, SnackbarOrigin } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface MessageSnackDisplay {
	// will become new default structure for errors
	show: boolean;
	message: string;
	/**
	 * If current message is an error. By default it is a success message
	 */
	error?: boolean;
}

interface MessageSnackProps {
	message: MessageSnackDisplay;
	setMessage: (e: MessageSnackDisplay) => void;
	/**
	 * Position of message, defaults to
	 *
	 * `{ vertical: "top", horizontal: "right" }`
	 */
	position?: SnackbarOrigin;
}

/**
 * Component to display a message in the form of a snack to the user
 */
const MessageSnack: React.FC<MessageSnackProps> = ({
	message,
	setMessage,
	position,
}) => {
	const { error } = message;

	const handleClose = () => {
		setMessage({ show: false, message: "", error: error });
	};

	return (
		<Snackbar
			open={message.show}
			autoHideDuration={error ? 10000 : 7000} // 10 seconds on error, 7 seconds on error
			onClose={handleClose}
			sx={{ m: 1 }}
			anchorOrigin={position ?? { vertical: "top", horizontal: "right" }}
			action={
				<>
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={handleClose}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</>
			}
		>
			<Alert
				onClose={handleClose}
				severity={error ? "error" : "success"}
				sx={{ width: "100%" }}
			>
				{message.message}
			</Alert>
		</Snackbar>
	);
};

export default MessageSnack;
