import { useUser } from "@supabase/auth-helpers-react";
import Typography from "antd/es/typography/Typography";
import React from "react";

const CreateProjectPage: React.FC = () => {
    // const supabaseClient = useSupabaseClient<Database>();
    const user = useUser();

    if (!user) return <Typography>Not Logged in</Typography>;

    console.log(user);

    // console.log(supabaseClient.auth.getUser());

    return (
        <>
            <h1>Hello World</h1>
        </>
    );
};

export default CreateProjectPage;
