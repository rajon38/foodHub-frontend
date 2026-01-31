
import PaginationControls from "@/components/ui/pagination-control";
import { mealsService } from "@/services/meal.service";
import { Meal } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const { data: meals, meta, error } =
    await mealsService.getAllMeals({ page: Number(page) });

  const pagination = meta || {
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 1,
  };

  if (error) {
    return (
      <main className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500">Failed to load meals.</p>
      </main>
    );
  }

  if (!meals.length) {
    return (
      <main className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">No meals found 🍽️</p>
      </main>
    );
  }

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            All Meals
          </h1>
          <p className="text-gray-600 mt-2">
            Discover meals from top restaurants near you
          </p>
        </div>
      </section>

      {/* ================= MEALS GRID ================= */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {meals.map((meal: Meal) => (
            <Link
              key={meal.id}
              href={`/meals/${meal.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="relative h-52">
                <Image
                  src={FALLBACK_IMAGE}
                  alt={meal.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${meal.price.toFixed(2)}
                </span>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold">{meal.name}</h2>

                <p className="text-sm text-gray-500">
                  {meal.category?.name || "Unknown Category"}
                </p>

                <span
                  className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${
                    meal.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {meal.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="mt-12">
          <PaginationControls meta={pagination} />
        </div>
      </section>
    </main>
  );
}
