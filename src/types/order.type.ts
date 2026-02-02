export interface OrderStatus{
    PENDING : string;
    CONFIRMED : string;
    ACCEPTED : string;
    PREPARING : string;
    ON_THE_WAY : string;
    DELIVERED : string;
    CANCELLED : string;
}

export interface Order {
    id: string;
    customerId: string;
    providerId: string;
    totalPrice: number;
    status: OrderStatus;
    items: Array<{
        mealId: string;
        quantity: number;
    }>;
    paymentMethod: string;
    deliveryAddress: string;
    customer: {
        name: string;
        email: string;
    };
    provider: {
        restaurantName: string;
    };
    createdAt: string;
}