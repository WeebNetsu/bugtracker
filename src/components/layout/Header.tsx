import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button, Space } from "antd";
import React from "react";

const Header: React.FC = () => {
    const supabaseClient = useSupabaseClient();

    return (
        <header>
            <Space>
                <Button type="link" onClick={() => supabaseClient.auth.signOut()}>
                    Logout
                </Button>
            </Space>
        </header>
    );
};

export default Header;
