import { categoriesService } from "@/services/categories.service";
import Link from "next/link";
import { Category } from "@/types";

export default async function CategoriesPage() {
  const { data: categories, error } =
    await categoriesService.getAllCategories();

  if (error) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 text-lg">
          ❌ Failed to load categories.
        </p>
      </main>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          No categories available yet 🍽️
        </p>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Browse Categories
          </h1>
          <p className="text-gray-600 mt-2 max-w-xl">
            Explore meals by category and find exactly what you’re craving.
          </p>
        </div>
      </section>

      {/* ================= CATEGORIES GRID ================= */}
      <section className="container mx-auto px-6 py-14">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category: Category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.id}`}
                className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
              >
                {/* Optional icon / emoji placeholder */}
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 text-xl font-bold">
                  🍔
                </div>

                <h2 className="text-lg font-bold group-hover:text-orange-500 transition">
                  {category.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Discover delicious meals
                </p>

                <span className="inline-block mt-4 text-sm text-orange-600 font-medium">
                  View meals →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
