import Loader from "@/components/ui/Loader";
import ProjectBox from "@/components/ui/ProjectBox";
import ProjectModel from "@/models/project";
import { parseApiResponse, sendGetRequest, uiHandleRequestFailed } from "@/utils/requests";
import { PlusOutlined } from "@ant-design/icons";
import { useUser } from "@supabase/auth-helpers-react";
import { Space, Typography, message } from "antd";
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
            <Typography.Title level={3} style={{ marginTop: 0 }}>
                Your Projects:
            </Typography.Title>

            <Space>
                {userProjects.map(up => (
                    <ProjectBox key={String(up._id)} project={up} />
                ))}

                <Link href={"/project/create"}>
                    <div className="boxWithCenterText">
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            <PlusOutlined />
                        </Typography.Title>
                    </div>
                </Link>
            </Space>
        </Space>
    );
}
