import { cookies } from "next/headers";
const AUTH_URL = process.env.AUTH_URL
const API_URL = process.env.API_URL

export const userService ={
    getSession: async function() {
        try {
            const cookieStore = await cookies();
            console.log(cookieStore.toString());
            const res = await fetch(`${AUTH_URL}/get-session`,
                {
                    headers: {
                    cookie: cookieStore.toString()
                    },
                    cache: "no-store"
                }
            );

        const session = await res.json();
        if (session === null) {
            return {data: null, error: {message: "No active session"}};
        }
        return {data: session, error: null};
        } catch (error) {
            console.error( error);
            return {data: null, error: {message: "Failed to fetch session"}};
        }
    },

    getProfile: async function () {
        try {
            const cookieStore = await cookies();
            const url = `${API_URL}/api/users/profile`;

            const config: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: cookieStore.toString()
                },
                cache: "no-store"
            };

            const res = await fetch(url, config);

            // Check if response is OK before parsing
            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Profile fetch failed: ${res.status} ${res.statusText}`, errorText);
                return {
                    data: null,
                    error: { 
                        message: `Failed to fetch profile: ${res.status}`,
                        status: res.status
                    }
                };
            }

            const data = await res.json();

            return {
                data,
                error: null
            };
        } catch (error) {
            console.error("Profile error:", error);
            return {
                data: null,
                error: { 
                    message: error instanceof Error ? error.message : "Failed to fetch profile"
                },
            };
        }
    },
}