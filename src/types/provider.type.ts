import { Meal } from "./meal.type";

export interface Provider {
    id: string;
    userId: string;
    restaurantName?: string;
    description?: string;
    address?: string;
    phone?: string;
    isOpen?: boolean;
    createdAt: string;
    meals?: Meal[];
}