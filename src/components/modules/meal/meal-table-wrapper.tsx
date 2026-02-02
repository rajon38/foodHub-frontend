"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MealTable } from "./meal-table";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

interface MealTableWrapperProps {
  meals: Meal[];
  pagination: PaginationMeta;
  onEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => Promise<void>;
}

export function MealTableWrapper({
  meals,
  pagination,
  onEdit,
  onDelete,
}: MealTableWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async (mealId: string) => {
    const toastId = toast.loading("Deleting meal...");
    try {
      await onDelete(mealId);
      toast.success("Meal deleted successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete meal", { id: toastId });
    }
  };

  return (
    <MealTable
      meals={meals}
      pagination={pagination}
      onPageChange={handlePageChange}
      onEdit={onEdit}
      onDelete={handleDelete}
    />
  );
}