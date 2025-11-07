import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
// NOTE: Router order for wouter is important

/**
 * User does not have to be logged in to view these routes
 */
export const publicRoutes = {
    login: {
        path: "/login",
        element: LoginPage,
    },
    signup: {
        path: "/signup",
        element: LoginPage,
    },
    home: {
        path: "/",
        element: HomePage,
    },
    default: {
        path: "*",
        element: LoginPage,
    },
};

/**
 * User has to be logged in to view these routes
 */
export const protectedRoutes = {
    home: {
        path: "/",
        element: HomePage,
    },
    default: {
        path: "*",
        element: NotFoundPage,
    },
    // admin: {
    //     path: '/admin',
    //     element: (<AdminPage />) ,
    // },
};
