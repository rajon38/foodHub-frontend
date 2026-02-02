"use server";

import { categoriesService, CategoryData } from "@/services/categories.service";
import { updateTag } from "next/cache";


export const createCategory = async (data: CategoryData) => {
  const res = await categoriesService.createCategory(data);
  updateTag("categories");
  return res;
};

export const updateCategory = async (id: string, data: CategoryData) => {
  const res = await categoriesService.updateCategory(id, data);
  updateTag("categories");
  return res;
}