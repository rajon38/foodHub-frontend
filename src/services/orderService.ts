import { env } from "@/env";
import { create } from "domain";
import { cookies } from "next/headers";
const API_URL = env.API_URL;


export interface OrderData {
    providerId: string;
    deliveryAddress: string;
    paymentMethod: string;
    items: Array<{
        mealId: string;
        quantity: number;
    }>;
    totalPrice: number;
}

interface OrderParams {
  customerId?: string;
  providerId?: string;
  page?: number;
  limit?: number;
}

export const orderService = {
    createOrder: async (data: OrderData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    cookie: cookieStore.toString()
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to create order: ${res.status} ${res.statusText} - ${errorText}`);
            }

            const json = await res.json();
            return {
                data: json,
                error: null,
            };

        } catch (err) {
            return {
        data: null,
        error: { 
          message: err instanceof Error ? err.message : "Something went wrong while creating the order" 
        },
      };
        }
    },
    getAllOrders: async (params: OrderParams) => {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/api/orders`);
        
        // Append query parameters if provided
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, value.toString());
            }
        });

        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieStore.toString()
            },
            cache: "no-store"
        });


        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const json = await res.json();
        const pagination = {
            page: json.meta.page,
            limit: json.meta.limit,
            totalPages: json.meta.totalPages,
            totalItems: json.meta.total, // Map 'total' to 'totalItems'
        };
        
        return {
            data: json.orders,
            meta: pagination,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            meta: null,
            error: { 
                message: err instanceof Error ? err.message : "Something went wrong while fetching orders" 
            },
        };
    }
    },
    updateOrder: async (orderId: string, updateData: Partial<OrderData>) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieStore.toString()
            },
            body: JSON.stringify(updateData),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update order: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const json = await res.json();
        return {
            data: json,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: { 
                message: err instanceof Error ? err.message : "Something went wrong while updating the order" 
            },
        };
    }
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/orders/status/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieStore.toString()
            },
            body: JSON.stringify({ status }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update order status: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const json = await res.json();
        return {
            data: json,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: { 
                message: err instanceof Error ? err.message : "Something went wrong while updating the order status" 
            },
        };
    }
  },
  orderDelete: async (orderId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookieStore.toString()
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to delete order: ${res.status} ${res.statusText} - ${errorText}`);
        }

        return {
            data: true,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: { 
                message: err instanceof Error ? err.message : "Something went wrong while deleting the order" 
            },
        };
    }
  }
};