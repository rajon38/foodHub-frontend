import { categoriesService } from "@/services/categories.service";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryDetailsPage({ params }: PageProps) {
  const { id } = await params; // ✅ MUST await params

  const { data: category, error } =
    await categoriesService.getCategoryById(id);

  if (error || !category) {
    notFound();
  }

  const meals = category.meals ?? [];

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">{category.name}</h1>

      {meals.length === 0 ? (
        <p className="text-muted-foreground">
          No meals available for this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {meals.map((meal: any) => (
            <Link
              key={meal.id}
              href={`/meals/${meal.id}`}
              className="block border rounded-xl overflow-hidden hover:shadow-lg transition duration-200"
            >
              <div className="relative h-40 w-full bg-gray-100">
                <Image
                  src={FALLBACK_IMAGE}
                  alt={meal.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-medium">{meal.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {meal.description}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="font-semibold">${meal.price.toFixed(2)}</span>

                  <span
                    className={`text-xs ${
                      meal.isAvailable ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {meal.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
