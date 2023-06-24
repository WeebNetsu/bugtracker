import ProjectStatusModel from "@/models/projectStatus";
import { AvailableRequestMethods } from "@/models/requests";
import TaskModel from "@/models/task";
import { SingleProjectStatusPutRequestBodyModel } from "@/pages/api/projects/[projectId]/status/[statusId]/_models";
import { ProjectStatusTasksGetResponseModel } from "@/pages/api/projects/[projectId]/status/[statusId]/tasks/_models";
import useWindowDimensions from "@/utils/hooks";
import { parseApiResponse, sendGetRequest, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { EllipsisOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DangerousActionPopup from "../DangerousActionPopup";
import ProjectStatusCard from "./ProjectStatusCard";
import ProjectStatusCardCreator from "./ProjectStatusCardCreator";
import styles from "./styles/ProjectStatusContainer.module.scss";

interface StatusContainerProps {
    projectStatus: ProjectStatusModel;
    revalidateTaskData: boolean;
    setRevalidateTaskData: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string;
    setProjectStatuses: React.Dispatch<React.SetStateAction<ProjectStatusModel[]>>;
    projectStatuses: ProjectStatusModel[];
}

const StatusContainer: React.FC<StatusContainerProps> = ({
    projectStatus,
    projectId,
    revalidateTaskData,
    setRevalidateTaskData,
    setProjectStatuses,
    projectStatuses,
}) => {
    const BASE_API_URL = `/api/projects/${projectId}/status/${projectStatus._id}`;

    const { height: windowHeight } = useWindowDimensions();
    const [showDeletingStatusPopup, setShowDeletingStatusPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [projectStatusTasks, setProjectStatusTasks] = useState<TaskModel[]>([]);
    const [showCreateNewProject, setShowCreateNewProject] = useState(false);

    const statusHeight = windowHeight * (75 / 100);

    useEffect(() => {
        if (!loading && !revalidateTaskData) return;

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
                setRevalidateTaskData(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
                message.error("Unknown Error");
                setRevalidateTaskData(false);
            }
        };

        getData();
    }, [revalidateTaskData]);

    const handleStatusTitleChange = async (e: string) => {
        if (!projectId || typeof projectId !== "string") {
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

        const updatedStatuses = projectStatuses.map(status =>
            status._id === projectStatus._id ? { ...status, title: e } : status,
        );

        setProjectStatuses(updatedStatuses);
    };

    const handleStatusDelete = async () => {
        if (!projectId || typeof projectId !== "string") {
            return message.error("Could not get project ID");
        }

        const deletedProject = await sendPostRequest(BASE_API_URL, undefined, AvailableRequestMethods.DELETE);

        if (!deletedProject.ok) {
            return message.error("Could not delete status");
        }

        const updatedStatuses = projectStatuses.filter(status => status._id !== projectStatus._id);

        setProjectStatuses(updatedStatuses);
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
                statusId={String(projectStatus._id)}
                setProjectStatusTasks={setProjectStatusTasks}
            />

            {projectStatusTasks
                .sort((curr, prev) => curr.order - prev.order)
                .map(projTask => (
                    <Draggable draggableId={String(projTask._id)} index={projTask.order} key={String(projTask._id)}>
                        {provided => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <ProjectStatusCard title={projTask.title} description={projTask.description} />
                            </div>
                        )}
                    </Draggable>
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
