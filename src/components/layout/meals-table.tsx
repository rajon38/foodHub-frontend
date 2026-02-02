"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteMeal } from "@/actions/meal.action";
import { MealTableWrapper } from "../modules/meal/meal-table-wrapper";
import { MealFormDialog } from "../modules/meal/meal-dialog";

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

interface MealsPageClientProps {
  initialMeals: Meal[];
  initialPagination: PaginationMeta;
  categories: Category[];
  error: { message: string } | null;
}

export function MealsPageClient({
  initialMeals,
  initialPagination,
  categories,
  error,
}: MealsPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (meal: Meal) => {
    setSelectedMeal(meal);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedMeal(null);
    setDialogOpen(true);
  };

  const handleDelete = async (mealId: string) => {
    await deleteMeal(mealId);
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`?${params.toString()}`);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedMeal(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Management</h1>
        <p className="text-gray-600">
          Create, edit, and manage your restaurant's menu items
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        <Button
          onClick={handleCreate}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Meal
        </Button>
      </div>

      {/* Error Message */}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center mb-6">
          <p className="text-red-800 font-medium">Failed to load meals</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      ) : (
        /* Meals Table */
        <MealTableWrapper
          meals={initialMeals}
          pagination={initialPagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Meal Form Dialog */}
      <MealFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        meal={selectedMeal}
        categories={categories}
      />
    </div>
  );
}