import { env } from "@/env";
const API_URL = env.API_URL;

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

interface ProviderParams {
  search?: string;
  isOpen?: boolean;
  page?: number;
  limit?: number;
}

export const providerService = {
async getAllProviders(params?: ProviderParams,options?: ServiceOptions) {
  try {
    const url = new URL(`${API_URL}/api/providers`);
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
      tags: ["providers"],
    };

    const res = await fetch(url.toString(), config);

    console.log("Fetch URL:", url.toString());

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch providers: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    return {
      data: json.data,
      meta: json.meta,
      error: null,
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

async getProviderById(id: string) {
    try {
      const res = await fetch(`${API_URL}/api/providers/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log("Fetch URL:", `${API_URL}/api/providers/${id}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error (${res.status}):`, errorText);
        throw new Error(`Failed to fetch provider: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();

      console.log("Fetched Provider Data:", json);

      return {
        data: json,
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: { 
          message: err instanceof Error ? err.message : "Something went wrong while fetching the provider" 
        },
      };
    }
  },

async updateProvider(id: string) {
  
}
}