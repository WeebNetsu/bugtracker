import Loader from "@/components/loader";
import ProjectModel from "@/models/project";
import { SingleProjectGetResponseModel } from "@/pages/api/projects/[id]/_models";
import { parseApiResponse, sendGetRequest, uiHandleRequestFailed } from "@/utils/requests";
import { formatToHumanDate } from "@netsu/js-utils";
import { useUser } from "@supabase/auth-helpers-react";
import { Space, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import StatusItem from "./_statusItem";

const SpecificProjectPage: React.FC = () => {
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [userProject, setUserProject] = useState<ProjectModel | undefined>();
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
                style={{
                    width: "100%",
                }}
                // size={"middle"}
            >
                {userProject.statuses
                    .sort((prev, curr) => prev.orderIndex - curr.orderIndex)
                    .map(projectStatus => (
                        <StatusItem
                            projectStatus={projectStatus}
                            setUserProject={setUserProject}
                            key={projectStatus._id}
                            userProject={userProject}
                        />
                    ))}
            </Space>
        </Space>
    );
};

export default SpecificProjectPage;
