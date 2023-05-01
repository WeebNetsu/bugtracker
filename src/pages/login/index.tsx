import Loader from "@/components/loader";
import supabase from "@/utils/supabase";
import { checkStrEmpty, emailRegex } from "@netsu/js-utils";
import { Button, Form, Input, Space, Typography, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (checkStrEmpty(email)) {
            return message.error("Email is required");
        }

        if (checkStrEmpty(password)) {
            return message.error("Password is required");
        }

        if (!emailRegex.test(email)) {
            return message.error("Email is invalid");
        }

        if (password.length < 8 || password.length > 32) {
            return message.error("Password is invalid");
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error({ error });
            return;
        }

        setLoading(false);
        router.push("/");
    };

    if (loading) return <Loader />;

    return (
        <Form onFinish={handleSubmit}>
            <Space direction="vertical">
                <Typography.Title>Login</Typography.Title>

                <Input.Password
                    required
                    autoFocus
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                />

                <Input required autoFocus placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

                <Button htmlType="submit">Login</Button>

                <Typography>
                    Don{"'"}t have an account? <Link href={"/signup"}>Sign up</Link>.
                </Typography>
            </Space>
        </Form>
    );
};

export default LoginPage;
