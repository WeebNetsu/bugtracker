import ProjectModel, { ProjectStatusModel } from "@/models/project";
import { AvailableRequestMethods } from "@/models/requests";
import { SingleProjectPutRequestBodyModel } from "@/pages/api/projects/[id]/_models";
import useWindowDimensions from "@/utils/hooks";
import { sendPostRequest } from "@/utils/requests";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography, message } from "antd";
import { useRouter } from "next/router";
import React from "react";
import styles from "./_statusItem.module.scss";

interface StatusItemProps {
    projectStatus: ProjectStatusModel;
    setUserProject: React.Dispatch<React.SetStateAction<ProjectModel | undefined>>;
    userProject: ProjectModel;
}

const StatusItem: React.FC<StatusItemProps> = ({ projectStatus, setUserProject, userProject }) => {
    const router = useRouter();

    const { height: windowHeight } = useWindowDimensions();

    const statusHeight = windowHeight * (75 / 100);

    const handleStatusTitleChange = async (e: string) => {
        const { id } = router.query;

        if (!id || typeof id !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const { statuses = [] } = userProject;

        const updatedStatuses = statuses.map(status =>
            status._id === projectStatus._id ? { ...status, title: e } : status,
        );

        const updatedProject = { ...userProject, statuses: updatedStatuses };

        setUserProject(updatedProject);

        const updateStatusData: SingleProjectPutRequestBodyModel = {
            data: {
                statuses: updatedStatuses,
            },
        };

        const updated = await sendPostRequest(`/api/projects/${id}`, updateStatusData, AvailableRequestMethods.PUT);

        if (!updated.ok) {
            return message.error("Could not update project");
        }
    };

    return (
        <div className={styles.statusContainer} style={{ height: statusHeight }}>
            <Typography.Title
                level={5}
                style={{
                    margin: 0,
                    padding: 0,
                }}
                editable={{
                    onChange: handleStatusTitleChange,
                    triggerType: ["text"],
                }}
            >
                {projectStatus.title}
            </Typography.Title>

            <Button
                style={{
                    width: "100%",
                }}
            >
                <PlusOutlined />
            </Button>

            <Card title="Hello World" />
            <Card title="This is me" />
        </div>
    );
};

export default StatusItem;
