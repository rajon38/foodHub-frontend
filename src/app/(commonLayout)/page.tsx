import Image from "next/image";
import Link from "next/link";
import { mealsService } from "@/services/meal.service";
import { providerService } from "@/services/provider.service";
import { categoriesService } from "@/services/categories.service";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

export default async function HomePage() {
  const { data: categories } = await categoriesService.getAllCategories();
  const { data: meals } = await mealsService.getAllMeals({
    limit: 6,
    isAvailable: true,
  });
  const { data: providers } = await providerService.getAllProviders({
    limit: 6,
  });

  return (
    <main className="bg-slate-50">
      {/* ================= HERO ================= */}
      <section className="relative h-[75vh]">
        <Image
          src={HERO_IMAGE}
          alt="Food banner"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 max-w-3xl text-white">
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm">
              🍽️ Local restaurants near you
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Craving Something <span className="text-orange-500">Delicious?</span>
            </h1>

            <p className="mt-4 text-lg text-gray-200">
              Discover top meals, fast delivery, and unforgettable flavors —
              all in one place.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/meals"
                className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-xl font-semibold transition"
              >
                Explore Meals
              </Link>
              <Link
                href="/providers"
                className="border border-white/30 hover:bg-white hover:text-black px-7 py-3 rounded-xl font-semibold transition"
              >
                Restaurants
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <Link href="/categories" className="text-orange-600 hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories?.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
            >
              <div className="text-lg font-semibold group-hover:text-orange-500">
                {category.name}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Discover meals
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= MEALS ================= */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Meals</h2>
          <Link href="/meals" className="text-orange-600 hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {meals?.map((meal: any) => (
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
                <h3 className="text-lg font-bold">{meal.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {meal.description}
                </p>

                <span
                  className={`inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full ${
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
      </section>

      {/* ================= RESTAURANTS ================= */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Restaurants</h2>
            <Link href="/providers" className="text-orange-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {providers?.map((provider: any) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition bg-slate-50"
              >
                <Image
                  src={FALLBACK_IMAGE}
                  alt={provider.restaurantName}
                  width={400}
                  height={250}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold">
                    {provider.restaurantName}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {provider.description || "Great food, fast service"}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">
                      {provider.address || "Location not provided"}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        provider.isOpen
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {provider.isOpen ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
