import { env } from "@/env";
import { User } from "better-auth";
import { url } from "inspector/promises";
import { cookies } from "next/headers";
const AUTH_URL = process.env.AUTH_URL
const API_URL = process.env.API_URL

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

interface UserParams {
  search?: string;
  emailVerified?: boolean;
  page?: number;
  limit?: number;
}

export interface UserUpdateData {
  name?: string;
  phone?: string;
}

export const userService ={
    getSession: async () => {
        try {
            const cookieStore = await cookies();
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

    getProfile: async () =>{
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
            return {
                data: null,
                error: { 
                    message: error instanceof Error ? error.message : "Failed to fetch profile"
                },
            };
        }
    },
    
    getAllUsers: async (params?: UserParams, options?: ServiceOptions) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/api/users`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        url.searchParams.append(key, String(value));
                    }
                });
            }
            const config: RequestInit & { next?: any } = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: cookieStore.toString()
                },
            };

            // Add cache options if provided
            if (options?.cache) {
                config.cache = options.cache;
            }

            config.next = {
                ...(options?.revalidate !== undefined ? { revalidate: options.revalidate } : {}),
                tags: ["users"],
            };

            const res = await fetch(url, config);

            if (!res.ok) {
                throw new Error(`Failed to fetch users. Status: ${res.status}`);
            }

            const json = await res.json();

            return {
                data: Array.isArray(json.data) ? json.data : [],
                meta: json.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
                error: null
            };
        } catch (err) {
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
                error: { 
                    message: err instanceof Error ? err.message : "Something went wrong while fetching users" 
                },
            };
        }
    },

    updateProfile: async (data: UserUpdateData) => {
        try {
            const cookieStore = await cookies();
            const url = `${API_URL}/api/users/profile`;

            const config: RequestInit = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            };

            const res = await fetch(url, config);

            if (!res.ok) {
                throw new Error(`Failed to update profile. Status: ${res.status}`);
            }

            const updatedData = await res.json();

            return { data: updatedData, error: null };
        } catch (error) {
            return {
                data: null,
                error: { 
                    message: error instanceof Error ? error.message : "Something went wrong while updating profile" 
                },
            };
        }
    },

    deleteUser: async (id: string) => {
        try {
            const cookieStore = await cookies();
            const url = `${API_URL}/api/users/${id}`;

            const config: RequestInit = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: cookieStore.toString()
                },
            };

            const res = await fetch(url, config);

            if (!res.ok) {
                throw new Error(`Failed to delete user. Status: ${res.status}`);
            }

            return { success: true, error: null };
        } catch (error) {
            return {
                success: false,
                error: { 
                    message: error instanceof Error ? error.message : "Something went wrong while deleting user" 
                },
            };
        }
    }
}