export interface Profile {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin' | 'provider';
    emailVerified: boolean;
    providerProfile?: {
        restaurantName: string;
        description: string;
        address: string;
        phone: string;
        isOpen: boolean;
    };
}