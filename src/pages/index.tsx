import { PlusOutlined } from "@ant-design/icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { Button, Space, Typography } from "antd";
import Link from "next/link";

export default function Home() {
    const user = useUser();
    const supabaseClient = useSupabaseClient();

    if (!user) {
        return (
            <Auth
                redirectTo="http://localhost:3000/"
                // appearance={{ theme: ThemeSupa }}
                supabaseClient={supabaseClient}
                providers={[]}
                // socialLayout="horizontal"
            />
        );
    }

    return (
        <Space direction="vertical">
            <Typography>Navigation</Typography>
            <Space>
                <Link href={"/login"}>Login</Link>
                <Link href={"/signup"}>Signup</Link>
                <Button type="link" onClick={() => supabaseClient.auth.signOut()}>
                    Logout
                </Button>
            </Space>

            <Typography>
                Your Projects:{" "}
                <Link href={"/project/create"}>
                    <Button>
                        <PlusOutlined />
                    </Button>
                </Link>
            </Typography>

            <Typography>
                <Link href={"/project/12edwqasdasda/"}>Dummy Project</Link>
            </Typography>
        </Space>
    );
}
