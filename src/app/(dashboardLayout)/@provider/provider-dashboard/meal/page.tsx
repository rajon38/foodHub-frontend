import { mealsService } from "@/services/meal.service";
import { MealsPageClient } from "@/components/layout/meals-table";
import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Roles } from "@/constants/roles";
import { categoriesService } from "@/services/categories.service";

export const dynamic = "force-dynamic";


interface MealsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    providerId?: string;
  }>;
}

// Mock categories - Replace with actual category service call
const categories = await categoriesService.getAllCategories().then(res => res.data || []);

export default async function MealsPage({ searchParams }: MealsPageProps) {
  // Get user profile and verify provider role
  const { data: profile } = await userService.getProfile();

  if (!profile || profile.role !== Roles.provider) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const limit = 10;
  const providerId = profile.providerProfile.id;

  // Fetch meals
  const { data, meta, error } = await mealsService.getAllMeals(
    {
      page,
      limit,
      providerId,
      ...(search && { search }),
    },
    {
      cache: "no-store",
    }
  );
  return (
    <MealsPageClient
      initialMeals={data || []}
      initialPagination={meta || { page: 1, limit: 10, totalPages: 1, total: 0 }}
      categories={categories}
      error={error}
    />
  );
}