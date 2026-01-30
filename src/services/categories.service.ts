import { env } from "@/env";
import { cookies } from "next/headers";
const API_URL = env.API_URL;

interface ServiceOptions{
    cache?: RequestCache;
    revalidate?: number;
}

interface CategoryParams{
    name: string;
}

export const categoriesService = {
  async getAllCategories(
    params?: CategoryParams,
    options?: ServiceOptions
  ) {
    try {
      const url = new URL(`${API_URL}/api/categories`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }

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

  async getCategoryById(id: string, options?: ServiceOptions) {
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
};
