import LoginPage from "./views/LoginPage";
import TodoPage from "./views/TodoPage";

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
