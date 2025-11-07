/* eslint-disable react/button-has-type */
import { protectedRoutes } from "@/lib/routes";
import React from "react";
import { useLocation } from "wouter";
import { Button } from "../ui/button";

const RouteRenderer: React.FC = ({ children }) => {
    const [location, navigate] = useLocation();

    // add your navigation UI
    return (
        <>
            <Button onClick={() => navigate(protectedRoutes.home.path)}>Home</Button>
            {/* <button onClick={() => navigate(protectedRoutes.admin.path)}>Admin</button> */}

            {/* render route data */}
            {children}
        </>
    );
};

export default RouteRenderer;
