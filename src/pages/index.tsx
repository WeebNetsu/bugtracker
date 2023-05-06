import Loader from "@/components/ui/Loader";
import ProjectModel from "@/models/project";
import { parseApiResponse, sendGetRequest, uiHandleRequestFailed } from "@/utils/requests";
import { PlusOutlined } from "@ant-design/icons";
import { useUser } from "@supabase/auth-helpers-react";
import { Button, Space, Typography, message } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectsGetResponseModel } from "./api/projects/_models";

export default function Home() {
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [userProjects, setUserProjects] = useState<ProjectModel[]>([]);

    useEffect(() => {
        if (!user || !loading) return;

        if (userProjects.length > 0) {
            setLoading(false);
            return;
        }

        const getData = async () => {
            setLoading(true);
            try {
                const signupReq = await sendGetRequest("/api/projects");

                if (!signupReq.ok) {
                    await uiHandleRequestFailed(signupReq);
                    return setLoading(false);
                }

                const resp: ProjectsGetResponseModel = await parseApiResponse(signupReq);

                setUserProjects(resp.data);

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

    return (
        <Space direction="vertical">
            <Typography>
                Your Projects:{" "}
                <Link href={"/project/create"}>
                    <Button>
                        <PlusOutlined />
                    </Button>
                </Link>
            </Typography>

            <Typography>
                {userProjects.map(up => (
                    <Link href={`/project/${up._id}/`} key={String(up._id)}>
                        {up.title}
                    </Link>
                ))}
            </Typography>
        </Space>
    );
}
