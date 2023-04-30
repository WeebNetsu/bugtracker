import { Space, Typography } from "antd";
import Link from "next/link";

export default function Home() {
    return (
        <Space direction="vertical">
            <Typography>Navigation</Typography>
            <Space>
                <Link href={"/login"}>Login</Link>
                <Link href={"/signup"}>Signup</Link>
            </Space>

            <Typography>Your Projects:</Typography>
            <Typography>
                <Link href={"/project/12edwqasdasda/"}>Dummy Project</Link>
            </Typography>
        </Space>
    );
}
