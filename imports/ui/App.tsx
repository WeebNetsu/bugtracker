import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Switch } from 'wouter';
import { protectedRoutes, publicRoutes } from '../utils/constants/routes';
import RouteRenderer from './components/RouteRenderer';

const App: React.FC = () => {
    const userId = useTracker(() => Meteor.userId());

    // user is not logged in
    if (userId === null) {
        // you can add any config providers here to cover all public routes
        return (
            <div>
                <Switch>
                    {Object.values(publicRoutes).map((route) => (
                        <Route key={route.path} path={route.path}>
                            {route.element}
                        </Route>
                    ))}
                </Switch>

                <ToastContainer />
            </div>
        );
    }

    // still loading data from backend
    if (!userId) return <p>Loading</p>;

    // you can add any config providers here to cover all protected routes
    return (
        <div>
            <Switch>
                {Object.values(protectedRoutes).map((route) => (
                    <Route key={route.path} path={route.path}>
                        <RouteRenderer>{route.element}</RouteRenderer>
                    </Route>
                ))}
            </Switch>

            <ToastContainer />
        </div>
    );
};

export default App;
