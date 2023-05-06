import ProjectModel, { ProjectStatusModel } from "@/models/project";
import { AvailableRequestMethods } from "@/models/requests";
import TaskModel from "@/models/task";
import { SingleProjectStatusPutRequestBodyModel } from "@/pages/api/projects/[projectId]/status/[statusId]/_models";
import { ProjectStatusTasksGetResponseModel } from "@/pages/api/projects/[projectId]/status/[statusId]/tasks/_models";
import useWindowDimensions from "@/utils/hooks";
import { parseApiResponse, sendGetRequest, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { EllipsisOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import DangerousActionPopup from "../DangerousActionPopup";
import Loader from "../Loader";
import ProjectStatusCard from "./ProjectStatusCard";
import ProjectStatusCardCreator from "./ProjectStatusCardCreator";
import styles from "./styles/ProjectStatusContainer.module.scss";

interface StatusContainerProps {
    projectStatus: ProjectStatusModel;
    setUserProject: React.Dispatch<React.SetStateAction<ProjectModel | undefined>>;
    userProject: ProjectModel;
    projectId: string;
}

const StatusContainer: React.FC<StatusContainerProps> = ({ projectStatus, setUserProject, userProject, projectId }) => {
    const BASE_API_URL = `/api/projects/${projectId}/status/${projectStatus._id}`;

    const { height: windowHeight } = useWindowDimensions();
    const [showDeletingStatusPopup, setShowDeletingStatusPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [projectStatusTasks, setProjectStatusTasks] = useState<TaskModel[]>([]);
    const [showCreateNewProject, setShowCreateNewProject] = useState(false);

    const statusHeight = windowHeight * (75 / 100);

    useEffect(() => {
        if (!loading) return;

        const getData = async () => {
            setLoading(true);

            try {
                const getTasksReq = await sendGetRequest(`${BASE_API_URL}/tasks`);

                if (!getTasksReq.ok) {
                    await uiHandleRequestFailed(getTasksReq);
                    return setLoading(false);
                }

                const resp: ProjectStatusTasksGetResponseModel = await parseApiResponse(getTasksReq);

                setProjectStatusTasks(resp.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
                message.error("Unknown Error");
            }
        };

        getData();
    }, []);

    const handleStatusTitleChange = async (e: string) => {
        if (!projectId || typeof projectId !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const updateStatusData: SingleProjectStatusPutRequestBodyModel = {
            data: {
                title: e,
            },
        };

        const updated = await sendPostRequest(BASE_API_URL, updateStatusData, AvailableRequestMethods.PUT);

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
        if (!projectId || typeof projectId !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const deletedProject = await sendPostRequest(BASE_API_URL, undefined, AvailableRequestMethods.DELETE);

        if (!deletedProject.ok) {
            return message.error("Could not delete status");
        }

        const { statuses = [] } = userProject;

        const updatedStatuses = statuses.filter(status => status._id !== projectStatus._id);

        const updatedProject = { ...userProject, statuses: updatedStatuses };

        setUserProject(updatedProject);
    };

    if (loading) return <Loader />;

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
                onClick={() => setShowCreateNewProject(show => !show)}
            >
                {showCreateNewProject ? <MinusOutlined /> : <PlusOutlined />}
            </Button>

            <ProjectStatusCardCreator
                setShow={setShowCreateNewProject}
                show={showCreateNewProject}
                projectId={projectId}
                statusId={projectStatus._id}
                setProjectStatusTasks={setProjectStatusTasks}
            />

            {projectStatusTasks.map(projTask => (
                <ProjectStatusCard
                    key={String(projTask._id)}
                    title={projTask.title}
                    description={projTask.description}
                />
            ))}

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
