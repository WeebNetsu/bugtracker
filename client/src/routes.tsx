import LoginPage from "./views/loginPage";
import TodoPage from "./views/todoPage";

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
