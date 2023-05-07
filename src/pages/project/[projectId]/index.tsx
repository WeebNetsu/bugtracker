import Loader from "@/components/ui/Loader";
import StatusContainer from "@/components/ui/projectStatus/ProjectStatusContainer";
import ProjectModel from "@/models/project";
import { AvailableRequestMethods } from "@/models/requests";
import { SingleProjectGetResponseModel } from "@/pages/api/projects/[projectId]/_models";
import { SpecificProjectStatusTaskPutRequestModel } from "@/pages/api/projects/[projectId]/status/[statusId]/tasks/[taskId]/_models";
import { SingleProjectStatusPostRequestBodyModel } from "@/pages/api/projects/[projectId]/status/_models";
import { parseApiResponse, sendGetRequest, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { checkStrEmpty, formatToHumanDate } from "@netsu/js-utils";
import { useUser } from "@supabase/auth-helpers-react";
import { Button, Input, Space, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

const SpecificProjectPage: React.FC = () => {
    const user = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userProject, setUserProject] = useState<ProjectModel | undefined>();
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

                if (!getProjectReq.ok) {
                    await uiHandleRequestFailed(getProjectReq);
                    return setLoading(false);
                }

                const resp: SingleProjectGetResponseModel = await parseApiResponse(getProjectReq);

                setUserProject(resp.data);
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

        const { statuses = [] } = userProject;

        const newStatus = {
            _id: uuidv4(),
            orderIndex: statuses.length,
            title: newStatusTitle,
        };

        const updateStatusData: SingleProjectStatusPostRequestBodyModel = {
            data: newStatus,
        };

        const updated = await sendPostRequest(`/api/projects/${projectId}/status`, updateStatusData);

        if (!updated.ok) {
            return message.error("Could not update project statuses");
        }

        statuses.push(newStatus);

        const updatedProject = { ...userProject, statuses };

        setUserProject(updatedProject);
        setNewStatusTitle("");
    };

    const onDragEnd = async (e: DropResult) => {
        if (!e.destination) {
            return;
        }

        if (e.destination.index === e.source.index) {
            return;
        }

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
            "tasks",
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
            >
                {userProject.title}
            </Typography.Title>
            <Typography>{userProject.description}</Typography>
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
                        {userProject.statuses
                            .sort((prev, curr) => prev.orderIndex - curr.orderIndex)
                            .map(projectStatus => (
                                <Droppable droppableId={projectStatus._id} key={projectStatus._id}>
                                    {provided => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <StatusContainer
                                                projectId={projectId}
                                                projectStatus={projectStatus}
                                                setUserProject={setUserProject}
                                                userProject={userProject}
                                                revalidateTaskData={revalidateTaskData}
                                                setRevalidateTaskData={setRevalidateTaskData}
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
