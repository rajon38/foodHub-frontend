import { CategoryForm } from "@/components/modules/category/category-form";
import { categoriesService } from "@/services/categories.service";
import { Category } from "@/types/category.type";
import { CategoryDialog } from "@/components/modules/category/category-dialog";
export const dynamic = 'force-dynamic';
export default async function CategoriesPage() {
  const { data: categories, error } =
    await categoriesService.getAllCategories();

  if (error) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 text-lg">
          ❌ Failed to load categories.
        </p>
      </main>
    );
  }

  return (
    <div className="p-4">
      <main className="min-h-screen">
        {/* ================= HEADER WITH CREATE BUTTON ================= */}
        <section className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="text-gray-600 mt-1">
                Manage your food categories
              </p>
            </div>
            <CategoryDialog mode="create">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition">
                + Create Category
              </button>
            </CategoryDialog>
          </div>

          {/* ================= EMPTY STATE ================= */}
          {(!categories || categories.length === 0) && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-500 text-lg mb-6">
                No categories available yet
              </p>
              <CategoryDialog mode="create">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition">
                  Create Your First Category
                </button>
              </CategoryDialog>
            </div>
          )}

          {/* ================= CATEGORIES GRID ================= */}
          {categories && categories.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category: Category) => (
                <li
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition group relative"
                >
                  {/* Optional icon / emoji placeholder */}
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 text-xl font-bold">
                    🍔
                  </div>

                  <h2 className="text-lg font-bold group-hover:text-orange-500 transition">
                    {category.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Discover delicious meals
                  </p>

                  <div className="flex items-center gap-2 mt-4">

                    <CategoryDialog mode="edit" category={category}>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-md transition text-gray-600 hover:text-orange-600"
                        title="Edit category"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </CategoryDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}