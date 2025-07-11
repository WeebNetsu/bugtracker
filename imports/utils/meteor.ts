import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { UserModel } from '../api/users/models';
import { AvailableCollectionNames, CollectionTypeMap, MethodUtilMethodsFindCollectionModel } from '../api/utils/models';

// this function will automatically get the data retrieved data type
// it is also a bit shorter than calling utilMethods.findCollection
// it's an optional quality of life feature
export async function getDBData<K extends AvailableCollectionNames>(
    findData: { collection: K; count: true } & MethodUtilMethodsFindCollectionModel,
): Promise<number>;
// eslint-disable-next-line no-redeclare
export async function getDBData<K extends AvailableCollectionNames>(
    findData: { collection: K; onlyOne: true; count?: false } & MethodUtilMethodsFindCollectionModel,
): Promise<CollectionTypeMap[K] | undefined>;
// eslint-disable-next-line no-redeclare
export async function getDBData<K extends AvailableCollectionNames>(
    findData: { collection: K; onlyOne?: false; count?: false } & MethodUtilMethodsFindCollectionModel,
): Promise<CollectionTypeMap[K][]>;
/**
 * This is a wrapper for `Meteor.callAsync('utilMethods.findCollection', findData);`
 *
 * @note both Client and Server safe
 *
 * @param findData details of data required to fetch data
 * @returns data from db
 */
// eslint-disable-next-line no-redeclare
export async function getDBData(findData: MethodUtilMethodsFindCollectionModel): Promise<any> {
    return Meteor.callAsync('utilMethods.findCollection', findData);
}

/**
 * Get a users email.
 *
 * NOTE: This will return the users *first* email, so it may return unexpected
 * results if the user has multiple emails
 *
 * @param user Meteor user model
 * @returns user email
 */
export const getUserEmail = (user: UserModel | undefined) => {
    return _.first(user?.emails)?.address;
};

/**
 * This will find a user by their ID, equivalent to
 * `Meteor.users.findOne(userId) as unknown as UserModel | undefined`
 *
 * @param userId ID of user to find
 * @returns user
 */
export const getUserById = (userId: string) => {
    return Meteor.users.findOne(userId) as unknown as UserModel | undefined;
};
