import { mealsService } from "@/services/meal.service";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MealDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const { data: meal, error } = await mealsService.getMealById(id);

  if (error)
    return <p className="text-center text-red-500 mt-10">{error.message}</p>;
  if (!meal)
    return <p className="text-center mt-10 text-gray-500">Meal not found</p>;

  const IMAGE =
    meal.image && meal.image !== "string"
      ? meal.image
      : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="relative h-[55vh]">
        <Image src={IMAGE} alt={meal.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold">{meal.name}</h1>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-xl font-bold text-orange-600">
              ${meal.price.toFixed(2)}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                meal.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {meal.isAvailable ? "Available" : "Unavailable"}
            </span>

            {meal.totalReviews !== undefined && (
              <span className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="w-4 h-4 fill-yellow-400" />
                {meal.averageRating?.toFixed(1) || 0} ({meal.totalReviews})
              </span>
            )}
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="container mx-auto px-6 py-12 max-w-3xl">
        <p className="text-gray-700 leading-relaxed">{meal.description}</p>

        <div className="mt-6 text-sm text-gray-600 space-y-1">
          <p>
            Category:{" "}
            <span className="font-medium">{meal.category?.name}</span>
          </p>
          <p>
            Provider:{" "}
            <span className="font-medium">
              {meal.provider?.restaurantName}
            </span>
          </p>
        </div>

        <Link
          href="/meals"
          className="inline-block mt-8 text-orange-600 hover:underline"
        >
          ← Back to meals
        </Link>
      </section>
    </main>
  );
}
