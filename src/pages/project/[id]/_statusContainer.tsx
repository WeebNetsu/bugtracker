import DangerousActionPopup from "@/components/dangerousActionPopup";
import ProjectModel, { ProjectStatusModel } from "@/models/project";
import { AvailableRequestMethods } from "@/models/requests";
import { SingleProjectStatusPutRequestBodyModel } from "@/pages/api/projects/[projectId]/status/[statusId]/_models";
import useWindowDimensions from "@/utils/hooks";
import { sendPostRequest } from "@/utils/requests";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
    const [showDeletingStatusPopup, setShowDeletingStatusPopup] = useState(false);

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

    const handleStatusDelete = async () => {
        const { id } = router.query;

        if (!id || typeof id !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const deletedProject = await sendPostRequest(
            `/api/projects/${id}/status/${projectStatus._id}`,
            undefined,
            AvailableRequestMethods.DELETE,
        );

        if (!deletedProject.ok) {
            return message.error("Could not delete status");
        }

        const { statuses = [] } = userProject;

        const updatedStatuses = statuses.filter(status => status._id !== projectStatus._id);

        const updatedProject = { ...userProject, statuses: updatedStatuses };

        setUserProject(updatedProject);
    };

    return (
        <div className={styles.statusContainer} style={{ height: statusHeight }}>
            <Typography.Title
                level={5}
                style={{
                    // margin: 0,
                    marginBottom: "1rem",
                    padding: 0,
                    width: "70%",
                    margin: "auto",
                }}
                editable={{
                    onChange: handleStatusTitleChange,
                    triggerType: ["text"],
                }}
            >
                {projectStatus.title}
            </Typography.Title>

            {/* <Dropdown menu={menuProps}>
                <Button>
                    <Space>
                        Button
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown> */}

            <Dropdown
                menu={{
                    items: [
                        {
                            key: "archive-cards",
                            label: "Archive Cards",
                            disabled: true,
                        },
                        {
                            key: "delete-cards",
                            label: "Delete Cards",
                            disabled: true,
                            danger: true,
                        },
                        {
                            key: "delete-status",
                            label: "Delete Status",
                            danger: true,
                            onClick: () => setShowDeletingStatusPopup(true),
                        },
                    ],
                    // onClick: () => {},
                }}
            >
                <Button
                    type="text"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        marginTop: "0.5rem",
                        marginRight: "0.5rem",
                    }}
                >
                    <EllipsisOutlined />
                </Button>
            </Dropdown>

            <Button
                style={{
                    width: "100%",
                    marginTop: "1rem",
                }}
            >
                <PlusOutlined />
            </Button>

            <StatusCard title="Hello World" />
            <StatusCard title="This is me" />

            <DangerousActionPopup
                show={showDeletingStatusPopup}
                onConfirm={handleStatusDelete}
                setShow={setShowDeletingStatusPopup}
                description={`This will PERMANENTLY delete the "${projectStatus.title}" status.`}
            />
        </div>
    );
};

export default StatusContainer;
