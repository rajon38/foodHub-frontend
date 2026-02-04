import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    //baseURL: "http://localhost:5007/api/auth"
    baseURL: "https://client-hazel-theta.vercel.app/api/auth"
})