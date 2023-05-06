import Authorize from "@/components/auth/authorize";
import Header from "@/components/layout/Header";
import "@/styles/globals.scss";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useState } from "react";

// Retrieve the session token from Local Storage
// const sessionToken = localStorage.getItem("supabaseSession");

export default function App({ Component, pageProps }: AppProps) {
    // Create a new supabase browser client on every first render.
    const [supabaseClient] = useState(() =>
        createBrowserSupabaseClient({
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
            // options: {
            //     autoRefreshToken: true,
            //     persistSession: true,
            //     headers: {
            //         Authorization: `Bearer ${sessionToken}`,
            //     },
            // },
        }),
    );

    return (
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
            <Authorize>
                <Header />

                <Component {...pageProps} />
            </Authorize>
        </SessionContextProvider>
    );
}
