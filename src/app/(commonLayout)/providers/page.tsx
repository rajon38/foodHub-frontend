import { providerService } from "@/services/provider.service";
import Image from "next/image";
import Link from "next/link";

export default async function ProvidersPage() {
  const { data: providers, error } = await providerService.getAllProviders();

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10">
        {error.message}
      </p>
    );
  }

  if (!providers || providers.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No providers found.
      </p>
    );
  }

    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <main className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {providers.map((provider: any) => (
          <Link
            key={provider.id}
            href={`/providers/${provider.id}`}
            className="block border rounded-xl p-5 hover:shadow-lg transition"
          >
            <Image
                src={FALLBACK_IMAGE}
                alt={provider.restaurantName || "Restaurant Logo"}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-md mb-4"
            />

            <h2 className="text-xl font-semibold">
              {provider.restaurantName || "Unnamed Restaurant"}
            </h2>

            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {provider.description || "No description available"}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {provider.address || "No address"}
              </span>

              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  provider.isOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {provider.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
