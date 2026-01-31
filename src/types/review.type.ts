export interface Review {
    id: string;
    rating?: number;
    comment?: string;
    createdAt?: string;
    customer?: {
        id: string;
        name?: string;
    };
}