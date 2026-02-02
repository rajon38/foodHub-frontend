import { Category } from "./category.type";
import { Provider } from "./provider.type";
import { Review } from "./review.type";

export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    isAvailable?: boolean;
    views?: number;
    category?: Category;
    provider?: Provider
    review: Review[];
    totalReviews?: number;
    averageRating?: number;
}