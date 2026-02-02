import { env } from "@/env";
import { cookies } from "next/headers";
const API_URL = env.API_URL;

interface ServiceOptions{
    cache?: RequestCache;
    revalidate?: number;
}

export interface CategoryData {
    name: string;
}


export const categoriesService = {
  getAllCategories: async( options?: ServiceOptions) =>{
    try {
      const url = new URL(`${API_URL}/api/categories`);

      const config: RequestInit & { next?: any } = {};

      if (options?.cache) {
        config.cache = options.cache;
      }

      config.next = {
        ...(options?.revalidate ? { revalidate: options.revalidate } : {}),
        tags: ["categories"],
      };

      const res = await fetch(url.toString(), config);

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();

      // ✅ API returns array directly
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Something went wrong while fetching categories" },
      };
    }
  },

  getCategoryById: async (id: string, options?: ServiceOptions) => {
    try {
      const config: RequestInit & { next?: any } = {};

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      const res = await fetch(`${API_URL}/api/categories/${id}`, config);

      if (!res.ok) {
        throw new Error("Failed to fetch category");
      }

      const data = await res.json();

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Something went wrong while fetching category" },
      };
    }
  },
  createCategory: async (categoryData: CategoryData) =>{
    try {
      const cookieStore = await cookies();
      const url = `${API_URL}/api/categories`;

      const config: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: cookieStore.toString()
        },
        body: JSON.stringify(categoryData)
      };

      const res = await fetch(url, config);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Category creation failed: ${res.status} ${res.statusText}`, errorText);
        return {
          data: null,
          error: { 
            message: `Failed to create category: ${res.status}`,
            status: res.status
          }
        };
      }

      const data = await res.json();

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Category creation error:", error);
      return {
        data: null,
        error: { 
          message: error instanceof Error ? error.message : "Failed to create category"
        }
      };
    }
  },
  updateCategory: async (id: string, categoryData: CategoryData) => {
    try {
      const cookieStore = await cookies();
      const url = `${API_URL}/api/categories/${id}`;

      const config: RequestInit = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          cookie: cookieStore.toString()
        },
        body: JSON.stringify(categoryData)
      };

      const res = await fetch(url, config);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Category update failed: ${res.status} ${res.statusText}`, errorText);
        return {
          data: null,
          error: { 
            message: `Failed to update category: ${res.status}`,
            status: res.status
          }
        };
      }

      const data = await res.json();

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Category update error:", error);
      return {
        data: null,
        error: { 
          message: error instanceof Error ? error.message : "Failed to update category"
        }
      };
    }
  }
};
