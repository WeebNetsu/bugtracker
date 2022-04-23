import LoginPage from "./views/LoginPage";
import TodoPage from "./views/TodoPage";

const routes = [
    {
        path: '/login',
        component: <LoginPage />,
    },
    {
        path: '/signup',
        component: <LoginPage signup />,
    },
    {
        path: '/',
        component: <TodoPage />,
    },
    { // will redirect to home page if url is invalid
        path: '*',
        component: <TodoPage />,
    },
];

export default routes;
