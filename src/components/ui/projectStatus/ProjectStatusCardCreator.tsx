import TaskModel from "@/models/task";
import {
    ProjectStatusTasksGetResponseModel,
    ProjectStatusTasksPostRequestModel,
} from "@/pages/api/projects/[projectId]/status/[statusId]/tasks/_models";
import { parseApiResponse, sendGetRequest, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { checkStrEmpty } from "@netsu/js-utils";
import { Button, Form, Input, Space, message } from "antd";
import React, { useState } from "react";
import styles from "./styles/ProjectStatusCardCreator.module.scss";

interface ProjectStatusCardCreatorProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string;
    statusId: string;
    setProjectStatusTasks: React.Dispatch<React.SetStateAction<TaskModel[]>>;
}

const ProjectStatusCardCreator: React.FC<ProjectStatusCardCreatorProps> = ({
    show,
    setShow,
    projectId,
    statusId,
    setProjectStatusTasks,
}) => {
    const BASE_API_URL = `/api/projects/${projectId}/status/${statusId}/tasks`;

    const [title, setTitle] = useState("New Card");
    const [description, setDescription] = useState("");

    const closeCreator = () => {
        setTitle("New Card");
        setDescription("");
        setShow(false);
    };
    /* 
     setNewProjStatusCard({
                        _id: v4(),
                        orderIndex:
                            _.first(projectStatusTasks.sort((prev, curr) => prev.order - curr.order))?.order ?? 0,
                        title: "New Card",
                    }) */

    const handleSubmit = async () => {
        if (checkStrEmpty(title)) {
            return message.error("Title cannot be empty");
        }

        const newStatusCardData: ProjectStatusTasksPostRequestModel = {
            data: {
                title,
                description,
            },
        };

        const created = await sendPostRequest(BASE_API_URL, newStatusCardData);

        if (!created.ok) {
            return message.error("Could not create card");
        }

        try {
            const getTasksReq = await sendGetRequest(BASE_API_URL);

            if (!getTasksReq.ok) {
                await uiHandleRequestFailed(getTasksReq);
            }

            const resp: ProjectStatusTasksGetResponseModel = await parseApiResponse(getTasksReq);

            setProjectStatusTasks(resp.data);
        } catch (error) {
            console.error(error);
            message.error("Unknown Error");
        }

        closeCreator();
    };

    const handleCheckKeysDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && e.ctrlKey) {
            // console.log("Ctrl + Enter pressed");
            handleSubmit();
        }
    };

    if (!show) return <></>;

    return (
        <Form className={styles.statusCard} onFinish={handleSubmit}>
            <Input
                placeholder="Card Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ marginBottom: "1rem" }}
                onKeyDown={handleCheckKeysDown}
            />

            <Input.TextArea
                placeholder="Card Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: "1rem" }}
                // @ts-ignore it works so no reason to worry about it lol
                onKeyDown={handleCheckKeysDown}
            />

            <Space style={{ justifyContent: "flex-end", width: "100%" }}>
                <Button onClick={closeCreator}>Cancel</Button>
                <Button htmlType="submit">Create</Button>
            </Space>
        </Form>
    );
};

export default ProjectStatusCardCreator;
