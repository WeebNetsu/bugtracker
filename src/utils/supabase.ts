import { createClient } from "@supabase/supabase-js";

// these are public and allowed to be seen on the client
const PUBLIC_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_KEY = process.env.PUBLIC_SUPABASE_KEY;

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_KEY) {
    throw new Error("Missing required supabase keys");
}

// the data used here is safe to be used as is without needing to be hidden, it only provides read permissions
// Create a single supabase client for interacting with your database
// https://supabase.com/docs/reference/javascript/typescript-support
const supabase = createClient</* Database */ any>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

export default supabase;
