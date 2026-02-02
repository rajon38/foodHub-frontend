import { mealsService } from "@/services/meal.service";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Review } from "@/types";
import { OrderDialog } from "@/components/modules/orders/order-dialog";

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
      <section className="container mx-auto px-6 py-14 max-w-3xl">
        {/* Order Action Card - Sticky on scroll */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order this meal</p>
              <p className="text-2xl font-bold text-orange-600">
                ${meal.price.toFixed(2)}
              </p>
              {meal.provider?.restaurantName && (
                <p className="text-sm text-gray-500 mt-1">
                  from {meal.provider.restaurantName}
                </p>
              )}
            </div>
            <div className="w-full md:w-auto">
              <OrderDialog meal={meal} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3">About this meal</h2>
          <p className="text-gray-700 leading-relaxed">{meal.description}</p>

          <div className="mt-5 flex flex-wrap gap-6 text-sm text-gray-600">
            <p>
              Category:{" "}
              <span className="font-medium text-gray-900">
                {meal.category?.name}
              </span>
            </p>
            <p>
              Provider:{" "}
              <span className="font-medium text-gray-900">
                {meal.provider?.restaurantName}
              </span>
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
          <h2 className="text-xl font-bold mb-4">
            Reviews
            {meal.reviews?.length > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({meal.reviews.length})
              </span>
            )}
          </h2>

          {meal.reviews && meal.reviews.length > 0 ? (
            <ul className="space-y-5">
              {meal.reviews.map((review: Review) => (
                <li key={review.id} className="border-b last:border-b-0 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {review.customer?.name || "Anonymous"}
                    </span>

                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <span className="text-sm font-medium">
                        {review.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-gray-700">{review.comment}</p>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.createdAt || "").toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              No reviews yet. Be the first to review this meal 🍽️
            </p>
          )}
        </div>

        {/* Sticky Order Button for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg sm:hidden z-50">
          <OrderDialog meal={meal} />
        </div>

        {/* Back link */}
        <Link
          href="/meals"
          className="inline-block mt-10 text-orange-600 hover:underline font-medium"
        >
          ← Back to meals
        </Link>
      </section>
    </main>
  );
}