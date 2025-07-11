/* eslint-disable react/button-has-type */
import React from 'react';
import { useLocation } from 'wouter';
import { ComponentProps } from '/imports/types/interfaces';
import { protectedRoutes } from '/imports/utils/constants/routes';

interface RouteRendererProps extends ComponentProps {}

const RouteRenderer: React.FC<RouteRendererProps> = ({ children }) => {
    const [location, navigate] = useLocation();

    // add your navigation UI
    return (
        <>
            <button onClick={() => navigate(protectedRoutes.users.path)}>Users</button>
            {/* <button onClick={() => navigate(protectedRoutes.admin.path)}>Admin</button> */}

            {/* render route data */}
            {children}
        </>
    );
};

export default RouteRenderer;
