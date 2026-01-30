import { Category } from "./category.type";

export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    isAvailable?: boolean;
    views?: number;
    category?: Category;
    provider?: {
        restaurantName: string;
    };
    totalReviews?: number;
    averageRating?: number;
}