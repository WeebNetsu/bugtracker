import Loader from "@/components/loader";
import ProjectModel from "@/models/project";
import { SingleProjectGetResponseModel } from "@/pages/api/projects/[id]/_models";
import useWindowDimensions from "@/utils/hooks";
import { parseApiResponse, sendGetRequest, uiHandleRequestFailed } from "@/utils/requests";
import { PlusOutlined } from "@ant-design/icons";
import { formatToHumanDate } from "@netsu/js-utils";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button, Space, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Card from "./_card";
import styles from "./index.module.scss";

const SpecificProjectPage: React.FC = () => {
    const user = useUser();
    const supabaseClient = useSupabaseClient();
    const [loading, setLoading] = useState(true);
    const [userProject, setUserProject] = useState<ProjectModel | undefined>();
    const router = useRouter();
    const { height } = useWindowDimensions();

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
    }, [user]);

    if (loading) return <Loader />;

    if (!userProject) return <Typography>Project not found</Typography>;

    const statusHeight = height * (75 / 100);

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
                        <div
                            key={projectStatus._id}
                            className={styles.statusContainer}
                            style={{ height: statusHeight }}
                        >
                            <Typography.Title
                                level={5}
                                style={{
                                    margin: 0,
                                    padding: 0,
                                }}
                                editable={{
                                    onChange: e => {
                                        setUserProject(up => {
                                            if (!up) return up;

                                            return {
                                                ...up,
                                                statuses:
                                                    up?.statuses?.map(status =>
                                                        status._id === projectStatus._id
                                                            ? { ...status, title: e }
                                                            : status,
                                                    ) ?? [],
                                            };
                                        });
                                    },
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

                            <Card title="Hello World" />
                            <Card title="This is me" />
                        </div>
                    ))}
            </Space>
        </Space>
    );
};

export default SpecificProjectPage;
