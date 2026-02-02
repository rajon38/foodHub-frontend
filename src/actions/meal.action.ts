"use server";

import { mealsService, MealCreateData } from "@/services/meal.service";
import { updateTag } from "next/cache";

export const createMeal = async (data: MealCreateData) => {
  const res = await mealsService.createMeal(data);
  updateTag("meals");
  return res;
};

export const updateMeal = async (id: string, data: Partial<MealCreateData>) => {
  const res = await mealsService.updateMeal(id, data);
  updateTag("meals");
  return res;
};

export const deleteMeal = async (mealId: string) => {
  const res = await mealsService.deleteMeal(mealId);
  updateTag("meals");
  return res;
}