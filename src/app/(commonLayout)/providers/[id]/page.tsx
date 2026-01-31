import { providerService } from "@/services/provider.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProviderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const { data: provider, error } =
    await providerService.getProviderById(id);

    console.log("Provider ID:", id);
    console.log("Provider Data in Page:", provider);
    console.log("Provider Error in Page:", error);

  if (error || !provider) {
    notFound();
  }

  const meals = provider.meals ?? [];
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Provider Info */}
      <div className="mb-8">
        <Image
          src={FALLBACK_IMAGE}
          alt={provider.restaurantName || "Restaurant Logo"}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h1 className="text-3xl font-bold">
          {provider.restaurantName}
        </h1>

        <p className="text-gray-600 mt-2">
          {provider.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
          {provider.address && <span>📍 {provider.address}</span>}
          {provider.phone && <span>📞 {provider.phone}</span>}
          <span
            className={`font-medium ${
              provider.isOpen ? "text-green-600" : "text-red-500"
            }`}
          >
            {provider.isOpen ? "Open now" : "Currently closed"}
          </span>
        </div>
      </div>

      {/* Meals */}
      <h2 className="text-2xl font-semibold mb-4">Meals</h2>

      {meals.length === 0 ? (
        <p className="text-gray-500">
          No meals available from this provider.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {meals.map((meal: any) => (
            <Link
              key={meal.id}
              href={`/meals/${meal.id}`}
              className="block border rounded-xl p-4 hover:shadow-md transition"
            >
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

      <Link
        href="/providers"
        className="inline-block mt-8 text-blue-600 hover:underline"
      >
        ← Back to providers
      </Link>
    </main>
  );
}
