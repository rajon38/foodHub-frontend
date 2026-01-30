import { categoriesService } from "@/services/categories.service";
import Link from "next/link";
import { Category } from "@/types";

export default async function CategoriesPage() {
  const { data: categories, error } =
    await categoriesService.getAllCategories();

  if (error) {
    return (
      <main className="p-6">
        <p className="text-red-500">Failed to load categories.</p>
      </main>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <main className="p-6">
        <p>No categories found.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">All Categories</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category: Category) => (
          <li
            key={category.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <Link href={`/categories/${category.id}`}>
              <div>
                <h2 className="text-lg font-medium">{category.name}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
