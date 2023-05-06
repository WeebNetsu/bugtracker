import Loader from "@/components/loader";
import ProjectModel from "@/models/project";
import { AvailableRequestMethods } from "@/models/requests";
import {
    SingleProjectGetResponseModel,
    SingleProjectPutRequestBodyModel,
} from "@/pages/api/projects/[projectId]/_models";
import { parseApiResponse, sendGetRequest, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { checkStrEmpty, formatToHumanDate } from "@netsu/js-utils";
import { useUser } from "@supabase/auth-helpers-react";
import { Button, Input, Space, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import StatusContainer from "./_statusContainer";

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

        statuses.push({
            _id: uuidv4(),
            orderIndex: statuses.length,
            title: newStatusTitle,
        });

        const updatedProject = { ...userProject, statuses };

        setUserProject(updatedProject);

        const updateStatusData: SingleProjectPutRequestBodyModel = {
            data: {
                statuses: updatedProject.statuses,
            },
        };

        const updated = await sendPostRequest(`/api/projects/${id}`, updateStatusData, AvailableRequestMethods.PUT);

        if (!updated.ok) {
            return message.error("Could not update project statuses");
        }

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
            <Typography.Title>{userProject.title}</Typography.Title>
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
