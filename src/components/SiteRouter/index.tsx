import { publicRoutes } from "@/lib/routes";
import React from "react";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "wouter";

const SiteRouter: React.FC = () => {
    // user is not logged in
    // if (userId === null) {
    // you can add any config providers here to cover all public routes
    return (
        <div>
            <Switch>
                {Object.values(publicRoutes).map(route => (
                    <Route key={route.path} path={route.path}>
                        {route.element}
                    </Route>
                ))}
            </Switch>

            <ToastContainer />
        </div>
    );
    // }

    // still loading data from backend
    // if (!userId) return <p>Loading</p>;

    // // you can add any config providers here to cover all protected routes
    // return (
    //     <UserContextProvider>
    //         <Switch>
    //             {Object.values(protectedRoutes).map((route) => (
    //                 <Route key={route.path} path={route.path}>
    //                     <RouteRenderer>{route.element}</RouteRenderer>
    //                 </Route>
    //             ))}
    //         </Switch>

    //         <ToastContainer />
    //     </UserContextProvider>
    // );
};

export default SiteRouter;
