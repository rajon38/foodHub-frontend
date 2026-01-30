import { mealsService } from "@/services/meal.service";
import { Meal } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function MealsPage() {
  const { data: meals, meta, error } = await mealsService.getAllMeals();

  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!meals.length) return <p>No meals found.</p>;

  const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Meals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal: Meal) => (
          <Link key={meal.id} href={`/meals/${meal.id}`} className="border rounded-md overflow-hidden shadow hover:shadow-lg transition">
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={FALLBACK_IMAGE}
                alt={meal.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{meal.name}</h2>
              <p className="text-sm text-gray-600">{meal.category?.name || "Unknown Category"}</p>
              <p className="mt-2 font-bold">${meal.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
