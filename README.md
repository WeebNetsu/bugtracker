# Meteor TypeScript Template

For anyone who wants to start a working typescript project with Meteor.js 3 and up. This template contains basic routing, authentication and utilities as well as many typings often required my new meteor projects. The template should work with earlier versions of Meteor, but is currently tested on version 3.

## Content

- [Running](#running)
- [Project Structure](#project-structure)
- [Best Practices](#best-practices)
    - [Users Collection](#users-collection)
    - [Data Fetching](#data-fetching)
- [Project Dependencies](#project-dependencies)
- [Helpful Resources](#helpful-resources)

## Running

1. Install Dependencies: `meteor npm i`
1. Run project: `npm start`

## Project Structure

- **server/** - Startup actions and server-only utilities
- **imports/**
    - **api/** - Meteor methods, collection definitions, typescript collection models
    - **ui/** - All pages/views and components for the app
    - **startup/** - Contains all imports to be taken to the server on startup (collections, methods, publications)
    - **utils/** - Utility functions for the client

## Best Practices

### Users Collection

The users collection has been changed up a bit, by default you probably created it to look something like this:

```js
{
    _id: "",
    emails: [],
    profile: {}, // note this
    ...
}
```

Usually you'd put your users profile as an object inside your profile field, this however comes with quite a few down sides:

1. You will probably have nested objects inside your profile object, which can make MongoDB update and search queries more difficult to write.
1. When you just want the user profile, you need to find the whole user object, including their emails and other sensitive information.
1. When you just want specific information, such as the user email, you will fetch their whole profile, slowing down your site.

Whilst most of the above is avoidable with good programming practices, we all know that deadline is too close to worry about that. That's why I have proposed a new solution:

```js
userCollection -> {
    _id: "",
    emails: [],
    profile: "", // or just null/undefined
    ...
}

userProfileCollection -> {
    userId: "", // link to the user collection
    firstName: "",
    ...
}
```

This splits the user profile into its own collection, it has multiple benefits:

1. Nested objects up to 1 level is now much easier to work with, with MongoDB.
1. When you just want the user profile, you don't have to get the users data as well.
1. When you just want specific information, such as the user email, then you won't receive their whole profile object.
1. When filtering what data you want from a fetch request, you won't have to specify as much in TypeScript.

### Data fetching

It's often recommended to avoid using trackers, since they can cause a lot of performance issues down the line if not done properly from the start. So in most cases I recommend using my prebuilt MongoDB generator instead WITH field limiting to decrease the data you need to receive.

```tsx
export interface EditUserPageProps extends ComponentProps {}

// define what data you want to fetch, naming consists of
// "Mini" - cut down version of original model
// "HomePage" - the page this model was created for (will be very useful during development)
// "UserProfileModel" - the model being downsized
// it then extends the model using "Pick" which chooses specific data to include in the newly
// built model, in this case the "userId" field and all non-specified fields will be excluded
// from this new model. Feel free to export this model if it will be used in its child components
interface MiniHomePageUserProfileModel extends Pick<UserProfileModel, '_id' | 'firstName' | 'lastName'> {}

// here we define a constant that will help us limit the actual fields on data fetch
// it is recommended to place it DIRECTLY under or above the mini model, because
// if you change the model, you will likely want to change this constant as well
const miniHomePageUserProfileFields = {
    _id: 1,
    firstName: 1,
    lastName: 1,
};

const EditUserPage: React.FC<EditUserPageProps> = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    // specify the state and how it will look by specifying the model representing it
    const [user, setUser] = useState<MiniHomePageUserProfileModel | undefined>();

    // I recommend splitting your data fetches into their own functions, because
    // this will allow for partial data reloading. If you need any data another
    // fetch function provides, then you can specify it as parameters that should
    // be passed into this fetch function
    const fetchUserProfile = async () => {
        if (!userId) return;

        try {
            // if fetching the full collection, then getDBData will correctly infer
            // the interface on its own
            // the request is made here, if you did not specify onlyOne, then this will return
            // MiniHomePageUserProfileModel[] instead of MiniHomePageUserProfileModel | undefined
            const res: MiniHomePageUserProfileModel | undefined = await getDBData({
                // specify the collection you'll be searching in
                collection: AvailableCollectionNames.USER_PROFILE,
                // this is the same as any mongodb selector in meteor, go nuts
                selector: { userId },
                // if not specified, then an array of matches will be returned
                onlyOne: true,
                options: {
                    // here we specify what fields should be returned
                    fields: miniHomePageUserProfileFields,
                },
            });

            // save the data in a state
            setUser(res);
        } catch (error) {
            // custom error handler for meteor errors
            errorResponse(error as Meteor.Error, 'Could not get users');
        }
    };

    // this is where you specify your page initial data fetch, which includes all
    // fetch functions. This can be used to reload all the data on a page
    const fetchData = async (silent = false) => {
        // if silent is true, then no loader will be displayed
        if (!silent) setLoading(true);

        await fetchUserProfile();

        setLoading(false);
    };

    useEffect(() => {
        // only call it on the first render
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
```

This will prevent the need from creating any unnecessary trackers and make it simple enough to fetch any data you need without extra configuration.

## Project Dependencies

I have added a couple extra dependencies to make everything more convenient. I have avoided adding any major UI libraries, since each developer has their preference. I do however recommend [Ant Design](https://ant.design).

- [[INFO]](https://github.com/WeebNetsu/js-utils) `@netsu/js-utils` - These are a couple functions to ease development, developed by me, feel free to remove it, I tried keeping the usage of it to a minimum.
- [[INFO]](https://www.npmjs.com/package/dayjs) `dayjs` - For working with dates.
- [[INFO]](https://www.npmjs.com/package/lodash) `lodash` - For working with arrays, you could opt to use Meteor's built in [underscore](https://v2-docs.meteor.com/packages/underscore) package instead, however I found it to lack TypeScript support in the past.
- [[INFO]](https://www.npmjs.com/package/react-toastify) `react-toastify` - For sexy popup notifications (such as during a data fetching error).
- [[INFO]](https://www.npmjs.com/package/wouter) `wouter` - React Router Dom latest versions has [bugs](https://github.com/remix-run/react-router/issues/12381) which keeps us stuck on older versions.

## Helpful Resources

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [MongoDB](https://www.mongodb.com)
- [Meteor.js](https://www.meteor.com)

---

If you want to support the work I do, please consider donating to me on one of these platforms:

[<img alt="liberapay" src="https://img.shields.io/badge/-LiberaPay-EBC018?style=flat-square&logo=liberapay&logoColor=white" />](https://liberapay.com/stevesteacher/)
[<img alt="kofi" src="https://img.shields.io/badge/-Kofi-7648BB?style=flat-square&logo=ko-fi&logoColor=white" />](https://ko-fi.com/stevesteacher)
[<img alt="patreon" src="https://img.shields.io/badge/-Patreon-F43F4B?style=flat-square&logo=patreon&logoColor=white" />](https://www.patreon.com/Stevesteacher)
[<img alt="paypal" src="https://img.shields.io/badge/-PayPal-0c1a55?style=flat-square&logo=paypal&logoColor=white" />](https://www.paypal.com/donate/?hosted_button_id=P9V2M4Q6WYHR8)
[<img alt="youtube" src="https://img.shields.io/badge/-YouTube-ff0033?style=flat-square&logo=youtube&logoColor=white" />](https://www.youtube.com/channel/UCrIsEy0a57Fz3MdEOvhWbkw/join)
