export interface Meal {
    id: string;
    providerId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    views?: number;
    isAvailable?: boolean;
}