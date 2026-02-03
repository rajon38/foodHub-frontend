import { env } from "@/env";
import { cookies } from "next/headers";
const API_URL = env.API_URL;

export interface ReviewCreateData {
  rating: number;
  comment?: string;
  mealId: string;
}

export const reviewService = {
createReview: async (data: ReviewCreateData) =>{
    try {
        const cookieStore = await cookies();
        const url = `${API_URL}/api/reviews`;

        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieStore.toString()
            },
            body: JSON.stringify(data),
            cache: "no-store"
        };

        const res =  await fetch(url, config);
        if (!res.ok) {
            throw new Error('Failed to create review');
        }
        const review = await res.json();
        return {data: review, error: null};
    } catch (error) {
        console.error( error);
        return {data: null, error: {message: "Failed to create review"}};
    }
},
updateReview: async (id: string, data: Partial<ReviewCreateData>) =>{
    try {
        const cookieStore = await cookies();
        const url = `${API_URL}/api/reviews/${id}`;

        const config: RequestInit = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieStore.toString()
            },
            body: JSON.stringify(data),
            cache: "no-store"
        };

        const res =  await fetch(url, config);
        if (!res.ok) {
            throw new Error('Failed to update review');
        }
        const review = await res.json();
        return {data: review, error: null};
    } catch (error) {
        console.error( error);
        return {data: null, error: {message: "Failed to update review"}};
    }
},
deleteReview: async (id: string) =>{
    try {
        const cookieStore = await cookies();
        const url = `${API_URL}/api/reviews/${id}`;

        const config: RequestInit = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieStore.toString()
            },
            cache: "no-store"
        };

        const res =  await fetch(url, config);
        if (!res.ok) {
            throw new Error('Failed to delete review');
        }
        return {data: true, error: null};
    } catch (error) {
        console.error( error);
        return {data: null, error: {message: "Failed to delete review"}};
    }
}
};