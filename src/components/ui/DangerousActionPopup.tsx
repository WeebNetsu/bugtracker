import { Modal, Typography } from "antd";
import React from "react";

interface DangerousActionPopupProps {
    onConfirmAsync?: () => Promise<any>;
    onConfirm?: () => any;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    description?: string;
    title?: string;
}

const DangerousActionPopup: React.FC<DangerousActionPopupProps> = ({
    onConfirm,
    show,
    setShow,
    description,
    title,
    onConfirmAsync,
}) => {
    return (
        <Modal
            onOk={async () => {
                if (onConfirm) onConfirm();
                if (onConfirmAsync) await onConfirmAsync();
                setShow(false);
            }}
            open={show}
            okButtonProps={{ danger: true }}
            title={title ?? "This is a dangerous action."}
            onCancel={() => setShow(false)}
        >
            <Typography.Text strong>
                {description ?? "This action is very dangerous. Are you sure you want to continue?"}
            </Typography.Text>
        </Modal>
    );
};

export default DangerousActionPopup;
