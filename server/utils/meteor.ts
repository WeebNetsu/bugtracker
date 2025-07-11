/* eslint-disable import/prefer-default-export */

import { Meteor } from 'meteor/meteor';
import { UserModel } from '/imports/api/users/models';

/**
 * Get the current user (Meteor.user() equivalent)
 *
 * @meteor users.get.current
 *
 * @note **SERVER ONLY** (get.users.current method for client)
 *
 * @returns The current user
 */
export const currentUserAsync = async () => {
    return (await Meteor.userAsync()) as unknown as UserModel | undefined;
};
