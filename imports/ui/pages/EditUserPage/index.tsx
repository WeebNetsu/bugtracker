import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import NotFoundPage from '../NotFoundPage';
import UserProfileModel from '/imports/api/userProfile/models';
import { AvailableCollectionNames } from '/imports/api/utils/models';
import { ComponentProps } from '/imports/types/interfaces';
import { errorResponse } from '/imports/utils/errors';
import { getDBData } from '/imports/utils/meteor';

export interface EditUserPageProps extends ComponentProps {}

interface MiniHomePageUserProfileModel extends Pick<UserProfileModel, '_id' | 'firstName' | 'lastName'> {}

const miniHomePageUserProfileFields = {
    _id: 1,
    firstName: 1,
    lastName: 1,
};

const EditUserPage: React.FC<EditUserPageProps> = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<MiniHomePageUserProfileModel | undefined>();

    const fetchUserData = async () => {
        if (!userId) return;

        try {
            // if fetching the full collection, then getDBData will correctly infer
            // the interface on its own
            const res: MiniHomePageUserProfileModel | undefined = await getDBData({
                collection: AvailableCollectionNames.USER_PROFILE,
                selector: { userId },
                onlyOne: true,
                options: {
                    fields: miniHomePageUserProfileFields,
                },
            });

            // or if you'd prefer the old method of fetching data
            // const data: MethodUtilMethodsFindCollectionModel = {
            //     collection: AvailableCollectionNames.USER_PROFILE,
            //     selector: { userId },
            //     onlyOne: true,
            //     options: {
            //         fields: miniHomePageUserProfileFields,
            //     },
            // };

            // const res: MiniHomePageUserProfileModel | undefined = await Meteor.callAsync(
            //     'utilMethods.findCollection',
            //     data,
            // );

            setUser(res);
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }
    };
    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);

        await fetchUserData();

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!userId) return <p>No user identifier given</p>;
    if (loading) return <p>loading</p>;
    if (!user) return <NotFoundPage message="The user you were looking for could not be found" />;

    return (
        <div>
            <p>
                Edit page for {user.firstName} {user.lastName}
            </p>
        </div>
    );
};

export default EditUserPage;
