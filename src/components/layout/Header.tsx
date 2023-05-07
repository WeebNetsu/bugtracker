import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Menu, MenuProps } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    style?: React.CSSProperties,
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        style,
    } as MenuItem;
}

const leftMenu: MenuProps["items"] = [getItem(<HomeOutlined />, "home")];

const rightMenu: MenuProps["items"] = [getItem(<LogoutOutlined />, "logout")];

const Header: React.FC = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const [currentNav, setCurrentNav] = useState("home");

    const onClick: MenuProps["onClick"] = e => {
        setCurrentNav(e.key);

        switch (e.key) {
            case "logout":
                supabaseClient.auth.signOut();
                break;
            case "home":
                router.push("/");
                break;
        }
    };

    return (
        <nav style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <Menu
                onClick={onClick}
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["home"]}
                selectedKeys={[currentNav]}
                mode="horizontal"
                items={leftMenu} // only render "home" menu item
                style={{
                    width: "100%",
                }}
            />

            <Menu
                onClick={onClick}
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["logout"]}
                mode="horizontal"
                items={rightMenu} // only render "logout" menu item
            />
        </nav>
    );
};

export default Header;
