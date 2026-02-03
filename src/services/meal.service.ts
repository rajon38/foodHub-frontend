import { env } from "@/env";
import { cookies } from "next/headers";
const API_URL = env.API_URL;

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

interface MealParams {
  search?: string;
  providerId?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface MealCreateData {
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId: string;
  image?: string;
}

export const mealsService = {

getAllMeals: async(params?: MealParams,options?: ServiceOptions) =>{
  try {
    const url = new URL(`${API_URL}/api/meals`);


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
      },
    };

    // Add cache options if provided
    if (options?.cache) {
      config.cache = options.cache;
    }

    config.next = {
      ...(options?.revalidate !== undefined ? { revalidate: options.revalidate } : {}),
      tags: ["meals"],
    };

    const res = await fetch(url.toString(), config);
;

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch meals: ${res.status} ${res.statusText}`);
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
        message: err instanceof Error ? err.message : "Something went wrong while fetching meals" 
      },
    };
  }
},
getMealById: async(id: string, options?: ServiceOptions) => {
  try {
    const url = `${API_URL}/api/meals/${id}`;

    const config: RequestInit & { next?: any } = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (options?.cache) config.cache = options.cache;
    
    config.next = {
      ...(options?.revalidate !== undefined ? { revalidate: options.revalidate } : {}),
      tags: ["meals"],
    };

    const res = await fetch(url, config);

    if (!res.ok) {
      throw new Error(`Failed to fetch meal. Status: ${res.status}`);
    }

    const json = await res.json();

    // Check if the response has a 'data' property or is the data itself
    return { 
      data: json.data || json || null, 
      error: null 
    };
  } catch (err) {
    return {
      data: null,
      error: { 
        message: err instanceof Error ? err.message : "Something went wrong while fetching meal" 
      },
    };
  }
},

createMeal: async(data: MealCreateData) => {
  try {
    const cookieStore = await cookies();
    const url = `${API_URL}/api/meals`;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieStore.toString()
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(url, config);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create meal: ${res.status} ${res.statusText} - ${errorText}`);
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
        message: err instanceof Error ? err.message : "Something went wrong while creating meal" 
      },
    };
  }
},

updateMeal: async(id: string, data: Partial<MealCreateData>) => {
  try {
    const cookieStore = await cookies();
    const url = `${API_URL}/api/meals/${id}`;

    const config: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieStore.toString()
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(url, config);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update meal: ${res.status} ${res.statusText} - ${errorText}`);
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
        message: err instanceof Error ? err.message : "Something went wrong while updating meal" 
      },
    };
  }
},

deleteMeal: async(id: string) => {
  try {
    const cookieStore = await cookies();
    const url = `${API_URL}/api/meals/${id}`;

    const config: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieStore.toString()
      },
    };

    const res = await fetch(url, config);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete meal: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return {
      data: true,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: { 
        message: err instanceof Error ? err.message : "Something went wrong while deleting meal" 
      },
    };
  }
}
};