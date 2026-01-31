import { providerService } from "@/services/provider.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProviderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const { data: provider, error } =
    await providerService.getProviderById(id);

  if (error || !provider) notFound();

  const meals = provider.meals ?? [];
  const FALLBACK_IMAGE_1 =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  const FALLBACK_IMAGE_2 =
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="relative h-[45vh]">
        <Image
          src={FALLBACK_IMAGE_2}
          alt={provider.restaurantName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-6xl font-extrabold">
            {provider.restaurantName}
          </h1>
          <p className="mt-1 text-md opacity-90">
            {provider.description}
          </p>
        </div>
      </section>

      {/* INFO */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {provider.address && <span>📍 {provider.address}</span>}
          {provider.phone && <span>📞 {provider.phone}</span>}
          <span
            className={`font-semibold ${
              provider.isOpen ? "text-green-600" : "text-red-500"
            }`}
          >
            {provider.isOpen ? "Open now" : "Closed"}
          </span>
        </div>

        {/* MEALS */}
        <h2 className="text-2xl font-bold mt-10 mb-6">Meals</h2>

        {meals.length === 0 ? (
          <p className="text-gray-500">No meals available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {meals.map((meal: any) => (
              <Link
                key={meal.id}
                href={`/meals/${meal.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
              >
                <Image
                  src={FALLBACK_IMAGE_1}
                  alt={meal.name}
                  width={400}
                  height={240}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{meal.name}</h3>
                  <p className="text-sm text-gray-500">
                    {meal.category?.name}
                  </p>

                  <div className="flex justify-between mt-3">
                    <span className="font-semibold">
                      ${meal.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs ${
                        meal.isAvailable
                          ? "text-green-600"
                          : "text-red-500"
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
          className="inline-block mt-10 text-orange-600 hover:underline"
        >
          ← Back to restaurants
        </Link>
      </section>
    </main>
  );
}
