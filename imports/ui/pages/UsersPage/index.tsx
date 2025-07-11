import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useLocation } from 'wouter';
import { protectedRoutes } from '/imports/utils/constants/routes';

const UsersPage: React.FC = () => {
    const [location, navigate] = useLocation();

    return (
        <div style={{ width: '100%' }}>
            <h2>Users Page</h2>

            <p>
                Edit user example:{' '}
                <button
                    onClick={() => {
                        navigate(protectedRoutes.editUser.path.replace(':userId', Meteor.userId()));
                    }}
                    type="button"
                >
                    Go To
                </button>
            </p>
        </div>
    );
};

export default UsersPage;
