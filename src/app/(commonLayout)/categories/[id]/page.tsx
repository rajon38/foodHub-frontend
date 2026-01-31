import { categoriesService } from "@/services/categories.service";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const { data: category, error } =
    await categoriesService.getCategoryById(id);

  if (error || !category) notFound();

  const meals = category.meals ?? [];
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-10">
          <Link
            href="/categories"
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back to categories
          </Link>

          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
            {category.name}
          </h1>

          <p className="text-gray-600 mt-2">
            Explore delicious meals from this category
          </p>
        </div>
      </section>

      {/* ================= MEALS GRID ================= */}
      <section className="container mx-auto px-6 py-14">
        {meals.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No meals available in this category 🍽️
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {meals.map((meal: any) => (
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

                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {meal.description}
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
        )}
      </section>
    </main>
  );
}
