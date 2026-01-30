import { mealsService } from "@/services/meal.service";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react"; // optional icon for rating

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MealDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const { data: meal, error } = await mealsService.getMealById(id);

  if (error)
    return (
      <p className="text-red-500 text-center mt-10">{error.message}</p>
    );
  if (!meal)
    return <p className="text-center mt-10 text-gray-600">Meal not found.</p>;

  const FALLBACK_IMAGE =
    meal.image && meal.image !== "string"
      ? meal.image
      : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Meal Image */}
        <div className="relative md:w-1/2 h-72 md:h-[28rem] rounded-lg overflow-hidden shadow-md bg-gray-100">
          <Image
            src={FALLBACK_IMAGE}
            alt={meal.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Meal Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-gray-900">{meal.name}</h1>
          <p className="text-gray-500 text-sm">
            Category: <span className="font-medium">{meal.category?.name}</span>
          </p>
          <p className="text-2xl font-semibold text-green-600">
            ${meal.price.toFixed(2)}
          </p>
          <p className="text-gray-700">{meal.description}</p>

          <div className="flex items-center gap-4 mt-2">
            <p
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                meal.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {meal.isAvailable ? "Available" : "Unavailable"}
            </p>
            {meal.totalReviews !== undefined && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4" />
                <span>{meal.averageRating?.toFixed(1) || 0} ({meal.totalReviews})</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Provider:{" "}
            <span className="font-medium">
              {meal.provider?.restaurantName || "Unknown"}
            </span>
          </p>

          <Link
            href="/meals"
            className="mt-6 inline-block text-blue-600 hover:underline"
          >
            ← Back to all meals
          </Link>
        </div>
      </div>
    </main>
  );
}
