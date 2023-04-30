import { Button, Form, Input, Space, Typography } from "antd";
import React, { useState } from "react";

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <Form onFinish={handleSubmit}>
            <Space direction="vertical">
                <Typography.Title>Signup</Typography.Title>

                <Input
                    required
                    autoFocus
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

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
            </Space>
        </Form>
    );
};

export default SignupPage;
