import Loader from "@/components/ui/Loader";
import StatusContainer from "@/components/ui/projectStatus/ProjectStatusContainer";
import ProjectModel from "@/models/project";
import ProjectStatusModel from "@/models/projectStatus";
import { AvailableRequestMethods } from "@/models/requests";
import {
    SingleProjectGetResponseModel,
    SingleProjectPutRequestBodyModel,
    SingleProjectPutResponseModel,
} from "@/pages/api/projects/[projectId]/_models";
import { SpecificProjectStatusTaskPutRequestModel } from "@/pages/api/projects/[projectId]/status/[statusId]/tasks/[taskId]/_models";
import {
    ProjectStatusesPostRequestBodyModel,
    ProjectsStatusesGetResponseModel,
    SingleProjectStatusPostResponseModel,
} from "@/pages/api/projects/[projectId]/status/_models";
import { parseApiResponse, sendGetRequest, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { checkStrEmpty, formatToHumanDate } from "@netsu/js-utils";
import { useUser } from "@supabase/auth-helpers-react";
import { Button, Input, Space, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

const SpecificProjectPage: React.FC = () => {
    const user = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userProject, setUserProject] = useState<ProjectModel | undefined>();
    const [projectStatuses, setProjectStatuses] = useState<ProjectStatusModel[]>([]);
    const [newStatusTitle, setNewStatusTitle] = useState("");
    const [revalidateTaskData, setRevalidateTaskData] = useState(false);

    const { projectId } = router.query;

    useEffect(() => {
        if (!projectId || typeof projectId !== "string") {
            return;
        }

        if (!user || !loading) return;

        if (userProject) {
            setLoading(false);
            return;
        }

        const getData = async () => {
            setLoading(true);
            try {
                const getProjectReq = await sendGetRequest(`/api/projects/${projectId}`);
                const getProjectStatusesReq = await sendGetRequest(`/api/projects/${projectId}/status`);

                if (!getProjectReq.ok) {
                    await uiHandleRequestFailed(getProjectReq);
                    return setLoading(false);
                }

                if (!getProjectStatusesReq.ok) {
                    await uiHandleRequestFailed(getProjectStatusesReq);
                    return setLoading(false);
                }

                const projResp: SingleProjectGetResponseModel = await parseApiResponse(getProjectReq);

                const projStatusesResp: ProjectsStatusesGetResponseModel = await parseApiResponse(
                    getProjectStatusesReq,
                );

                setUserProject(projResp.data);
                setProjectStatuses(projStatusesResp.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
                message.error("Unknown Error");
            }
        };

        getData();
    }, [user, router.query]);

    const handleAddNewStatus = async () => {
        if (checkStrEmpty(newStatusTitle)) {
            return message.error("Title cannot be empty");
        }

        if (!projectId || typeof projectId !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const updateStatusData: ProjectStatusesPostRequestBodyModel = {
            title: newStatusTitle,
        };

        const newStatusReq = await sendPostRequest(`/api/projects/${projectId}/status`, updateStatusData);

        if (!newStatusReq.ok) {
            return message.error("Could not update project statuses");
        }

        const { data: newStatus }: SingleProjectStatusPostResponseModel = await parseApiResponse(newStatusReq);

        setProjectStatuses(ps => [...ps, newStatus]);
        setNewStatusTitle("");
    };

    const handleProjectTitleChange = async (projectTitle: string) => {
        if (checkStrEmpty(projectTitle)) {
            return message.error("Title cannot be empty");
        }

        if (!projectId || typeof projectId !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const updateProjectData: SingleProjectPutRequestBodyModel = {
            data: {
                title: projectTitle,
            },
        };

        const newProjReq = await sendPostRequest(
            `/api/projects/${projectId}`,
            updateProjectData,
            AvailableRequestMethods.PUT,
        );

        if (!newProjReq.ok) {
            return message.error("Could not update project");
        }

        const { data: newProject }: SingleProjectPutResponseModel = await parseApiResponse(newProjReq);

        setUserProject({ ...newProject, title: projectTitle });
    };

    const handleProjectDescChange = async (projectDesc: string) => {
        if (checkStrEmpty(projectDesc)) {
            return message.error("Title cannot be empty");
        }

        if (!projectId || typeof projectId !== "string" || !userProject) {
            return message.error("Could not get project ID");
        }

        const updateProjectData: SingleProjectPutRequestBodyModel = {
            data: {
                description: projectDesc,
            },
        };

        const newProjReq = await sendPostRequest(
            `/api/projects/${projectId}`,
            updateProjectData,
            AvailableRequestMethods.PUT,
        );

        if (!newProjReq.ok) {
            return message.error("Could not update project");
        }

        const { data: newProject }: SingleProjectPutResponseModel = await parseApiResponse(newProjReq);

        setUserProject({ ...newProject, description: projectDesc });
    };

    const onDragEnd = async (e: DropResult) => {
        if (!e.destination) {
            return;
        }

        // if (e.destination.index === e.source.index) {
        //     return;
        // }

        const taskId = e.draggableId;
        const newStatusId = e.destination.droppableId;
        const oldStatusId = e.source.droppableId;
        const newOrder = e.destination.index;
        const oldOrder = e.source.index;

        const updateData: SpecificProjectStatusTaskPutRequestModel = {
            data: {
                oldOrder,
                newOrder,
                statusId: newStatusId,
            },
        };

        const updateTaskReq = await sendPostRequest(
            `/api/projects/${projectId}/status/${oldStatusId}/tasks/${taskId}`,
            updateData,
            AvailableRequestMethods.PUT,
        );

        if (!updateTaskReq.ok) {
            await uiHandleRequestFailed(updateTaskReq);
            return setLoading(false);
        }

        setRevalidateTaskData(true);
    };

    if (loading) return <Loader />;

    if (!userProject) return <Typography>Project not found</Typography>;

    if (!projectId) return <Typography>No project ID provided </Typography>;
    if (typeof projectId !== "string") return <Typography>Invalid project ID </Typography>;

    return (
        <Space
            direction="vertical"
            style={{
                width: "100%",
            }}
        >
            <Typography.Title
                style={{
                    margin: 0,
                    padding: 0,
                }}
                editable={{
                    onChange: handleProjectTitleChange,
                    triggerType: ["text"],
                }}
            >
                {userProject.title}
            </Typography.Title>
            <Typography.Text
                editable={{
                    onChange: handleProjectDescChange,
                    triggerType: ["text"],
                }}
            >
                {userProject.description}
            </Typography.Text>
            <Typography>Created on {formatToHumanDate(userProject.createdAt)}</Typography>

            <Space
                className="hideScrollbar"
                style={{
                    width: "100%",
                    alignItems: "flex-start",
                    overflowX: "scroll",
                }}
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Space>
                        {projectStatuses
                            .sort((prev, curr) => prev.orderIndex - curr.orderIndex)
                            .map(projectStatus => (
                                <Droppable droppableId={String(projectStatus._id)} key={String(projectStatus._id)}>
                                    {provided => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <StatusContainer
                                                projectId={projectId}
                                                projectStatus={projectStatus}
                                                revalidateTaskData={revalidateTaskData}
                                                setRevalidateTaskData={setRevalidateTaskData}
                                                projectStatuses={projectStatuses}
                                                setProjectStatuses={setProjectStatuses}
                                            />

                                            <div
                                                style={{
                                                    display: "none",
                                                }}
                                            >
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                    </Space>
                </DragDropContext>

                <div
                    style={{
                        width: "20rem",
                    }}
                >
                    <Space>
                        <Input
                            placeholder="New Status"
                            value={newStatusTitle}
                            onChange={e => setNewStatusTitle(e.target.value)}
                        />
                        <Button onClick={handleAddNewStatus}>Add Status</Button>
                    </Space>
                </div>
            </Space>
        </Space>
    );
};

export default SpecificProjectPage;
