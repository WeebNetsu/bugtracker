import Loader from "@/components/ui/Loader";
import ProjectModel from "@/models/project";
import { SingleProjectGetResponseModel } from "@/pages/api/projects/[projectId]/_models";
import { SingleProjectStatusPostRequestBodyModel } from "@/pages/api/projects/[projectId]/status/_models";
import { parseApiResponse, sendGetRequest, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { checkStrEmpty, formatToHumanDate } from "@netsu/js-utils";
import { useUser } from "@supabase/auth-helpers-react";
import { Button, Input, Space, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import StatusContainer from "../../../components/ui/ProjectStatusContainer";

const SpecificProjectPage: React.FC = () => {
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [userProject, setUserProject] = useState<ProjectModel | undefined>();
    const [newStatusTitle, setNewStatusTitle] = useState("");
    const router = useRouter();

    useEffect(() => {
        const { id } = router.query;

        if (!id || typeof id !== "string") {
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
                const getProjectReq = await sendGetRequest(`/api/projects/${id}`);

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

        const { id } = router.query;

        if (!id || typeof id !== "string" || !userProject) {
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

        const updated = await sendPostRequest(`/api/projects/${id}/status`, updateStatusData);

        if (!updated.ok) {
            return message.error("Could not update project statuses");
        }

        statuses.push(newStatus);

        const updatedProject = { ...userProject, statuses };

        setUserProject(updatedProject);
        setNewStatusTitle("");
    };

    if (loading) return <Loader />;

    if (!userProject) return <Typography>Project not found</Typography>;

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
                {userProject.statuses
                    .sort((prev, curr) => prev.orderIndex - curr.orderIndex)
                    .map(projectStatus => (
                        <StatusContainer
                            projectStatus={projectStatus}
                            setUserProject={setUserProject}
                            key={projectStatus._id}
                            userProject={userProject}
                        />
                    ))}

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
