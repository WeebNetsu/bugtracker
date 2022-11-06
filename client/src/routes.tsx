import LoginPage from "./views/LoginPage";
import TodoPage from "./views/TodoPage";

/**
 * Routes to everywhere in app.
 *
 * @param path URL user can go to
 * @param component Component to render
 * @param requireLogin If the user needs to be logged in to view this page
 */
const routes = [
    {
        path: "/login",
        component: <LoginPage />,
        requireLogin: false,
    },
    {
        path: "/signup",
        component: <LoginPage signup />,
        requireLogin: false,
    },
    {
        path: "/",
        component: <TodoPage />,
        requireLogin: true,
    },
    {
        // will redirect to home page if url is invalid
        path: "*",
        component: <LoginPage />,
        requireLogin: false,
    },
];

export default routes;
