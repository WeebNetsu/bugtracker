import { ReactComponentProps } from "@/types/interfaces";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Space } from "antd";
import React from "react";

const Authorize: React.FC<ReactComponentProps> = ({ children }) => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();

    if (!user) {
        return (
            <Space
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Auth
                    redirectTo="/"
                    appearance={{ theme: ThemeSupa }}
                    supabaseClient={supabaseClient}
                    providers={[]}
                    magicLink
                    dark
                />
            </Space>
        );
    }

    return <>{children}</>;
};

export default Authorize;
