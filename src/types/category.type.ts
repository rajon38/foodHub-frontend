import { Meal } from "./meal.type";

export interface Category{
    id: string;
    name: string;
    meals?: Meal[];
}