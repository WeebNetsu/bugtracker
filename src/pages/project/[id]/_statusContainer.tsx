import ProjectModel, { ProjectStatusModel } from "@/models/project";
import { AvailableRequestMethods } from "@/models/requests";
import { SingleProjectStatusPutRequestBodyModel } from "@/pages/api/projects/[projectId]/status/[statusId]/_models";
import useWindowDimensions from "@/utils/hooks";
import { sendPostRequest } from "@/utils/requests";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography, message } from "antd";
import { useRouter } from "next/router";
import React from "react";
import StatusCard from "./_statusCard";
import styles from "./_statusContainer.module.scss";

interface StatusContainerProps {
    projectStatus: ProjectStatusModel;
    setUserProject: React.Dispatch<React.SetStateAction<ProjectModel | undefined>>;
    userProject: ProjectModel;
}

const StatusContainer: React.FC<StatusContainerProps> = ({ projectStatus, setUserProject, userProject }) => {
    const router = useRouter();

    const { height: windowHeight } = useWindowDimensions();

    const statusHeight = windowHeight * (75 / 100);

    const handleStatusTitleChange = async (e: string) => {
        const { id } = router.query;

        if (!id || typeof id !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const updateStatusData: SingleProjectStatusPutRequestBodyModel = {
            data: {
                title: e,
            },
        };

        const updated = await sendPostRequest(
            `/api/projects/${id}/status/${projectStatus._id}`,
            updateStatusData,
            AvailableRequestMethods.PUT,
        );

        if (!updated.ok) {
            return message.error("Could not update status");
        }

        const { statuses = [] } = userProject;

        const updatedStatuses = statuses.map(status =>
            status._id === projectStatus._id ? { ...status, title: e } : status,
        );

        const updatedProject = { ...userProject, statuses: updatedStatuses };

        setUserProject(updatedProject);
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

            <StatusCard title="Hello World" />
            <StatusCard title="This is me" />
        </div>
    );
};

export default StatusContainer;
