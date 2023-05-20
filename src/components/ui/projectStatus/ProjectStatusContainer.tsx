import ProjectModel, { ProjectStatusModel } from "@/models/project";
import { AvailableRequestMethods } from "@/models/requests";
import TaskModel from "@/models/task";
import { SingleProjectStatusPutRequestBodyModel } from "@/pages/api/projects/[projectId]/status/[statusId]/_models";
import { ProjectStatusTasksGetResponseModel } from "@/pages/api/projects/[projectId]/status/[statusId]/tasks/_models";
import { FakeTaskDataModel } from "@/pages/project/[projectId]";
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
    setUserProject: React.Dispatch<React.SetStateAction<ProjectModel | undefined>>;
    revalidateTaskData: boolean;
    setRevalidateTaskData: React.Dispatch<React.SetStateAction<boolean>>;
    fakeTaskData: FakeTaskDataModel;
    setFakeTaskData: React.Dispatch<React.SetStateAction<FakeTaskDataModel>>;
    userProject: ProjectModel;
    projectId: string;
}

const StatusContainer: React.FC<StatusContainerProps> = ({
    projectStatus,
    setUserProject,
    userProject,
    projectId,
    revalidateTaskData,
    setRevalidateTaskData,
    fakeTaskData,
    setFakeTaskData,
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

    useEffect(() => {
        if (!fakeTaskData.fake) return;
        if (!fakeTaskData.data) return;

        const fakeData = fakeTaskData.data;

        const toNewStatus = !!fakeData.newStatusId;

        if (fakeData.newStatusId !== projectStatus._id || fakeData.oldStatusId === projectStatus._id) {
            return;
        }

        const getData = async () => {
            setLoading(true);

            try {
                if (fakeTaskData.revert) {
                    // todo
                } else {
                    if (toNewStatus && fakeData.oldStatusId !== projectStatus._id) {
                        setProjectStatusTasks(psts => psts.filter(pst => pst.order !== fakeData.newOrder));
                    } else if (toNewStatus && fakeData.oldStatusId === projectStatus._id) {
                        if (!fakeData) return;

                        setProjectStatusTasks(psts => [
                            ...psts.map(pst =>
                                pst.order >= fakeData.newOrder ? { ...pst, order: pst.order + 1 } : pst,
                            ),
                        ]);
                    }
                }

                setFakeTaskData(false);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setFakeTaskData(false);
                console.error(error);
                message.error("Unknown Error");
            }
        };

        getData();
    }, [fakeTaskData]);

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

    // if (loading) return <Loader />;

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
