import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import NotFoundPage from '../NotFoundPage';
import UserProfileModel from '/imports/api/userProfile/models';
import { SITE_NAME } from '/imports/utils/constants';
import { errorResponse } from '/imports/utils/errors';

const HomePage: React.FC = () => {
    const [user, setUser] = useState<UserProfileModel | undefined>();
    const [loading, setLoading] = useState(true);

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res: UserProfileModel | undefined = await Meteor.callAsync('get.userProfiles.current');

            setUser(res);
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get your account');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p>Loading</p>;
    if (!user) return <NotFoundPage message="No Access To This Page" />;

    return (
        <div>
            <p>
                Hello {user.firstName}, welcome to {SITE_NAME}
            </p>

            <div>
                <button onClick={() => Meteor.logout()} type="button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;
