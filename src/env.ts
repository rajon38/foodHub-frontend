import {createEnv} from "@t3-oss/env-nextjs"
import * as z from "zod"

export const env = createEnv({
    server: {
        BACKEND_API: z.url(),
        FRONTEND_API: z.url(),
        API_URL: z.url(),
        AUTH_URL: z.url(),
    },
    client: {
        NEXT_PUBLIC_API_TEST: z.string(),//example
        NEXT_PUBLIC_FRONTEND_API: z.url(),
        NEXT_PUBLIC_BACKEND_URL: z.url(),
    },
    runtimeEnv: {
        BACKEND_API: process.env.BACKEND_API,
        FRONTEND_API: process.env.FRONTEND_API,
        API_URL: process.env.API_URL,
        AUTH_URL: process.env.AUTH_URL,
        NEXT_PUBLIC_API_TEST: process.env.NEXT_PUBLIC_API_TEST,
        NEXT_PUBLIC_FRONTEND_API: process.env.NEXT_PUBLIC_FRONTEND_API,
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    }
})