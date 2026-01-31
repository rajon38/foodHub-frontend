import { providerService } from "@/services/provider.service";
import Image from "next/image";
import Link from "next/link";

export default async function ProvidersPage() {
  const { data: providers, error } = await providerService.getAllProviders();

  if (error)
    return <p className="text-center text-red-500 mt-10">{error.message}</p>;

  if (!providers?.length)
    return <p className="text-center text-gray-500 mt-10">No restaurants found</p>;

  const FALLBACK =
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5";

  return (
    <main className="bg-slate-50 min-h-screen">
              {/* ================= HEADER ================= */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Restaurants
          </h1>
          <p className="text-gray-600 mt-2">
            Discover restaurants from top providers near you
          </p>
        </div>
      </section>
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {providers.map((provider: any) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <Image
                src={FALLBACK}
                alt={provider.restaurantName}
                width={400}
                height={240}
                className="w-full h-52 object-cover group-hover:scale-105 transition"
              />

              <div className="p-5">
                <h2 className="text-lg font-bold">
                  {provider.restaurantName}
                </h2>

                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {provider.description || "Delicious meals & fast service"}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    {provider.address || "Location not available"}
                  </span>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      provider.isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {provider.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
