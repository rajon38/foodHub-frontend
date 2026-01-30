import { cookies } from "next/headers";
const AUTH_URL = process.env.AUTH_URL

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
    }
}