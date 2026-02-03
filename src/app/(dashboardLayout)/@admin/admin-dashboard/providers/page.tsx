import { providerService } from "@/services/provider.service";
import { ProviderTable } from "@/components/modules/provider/provider-table";
import { ProviderDialog } from "@/components/modules/provider/provider-dialog";
import { Suspense } from "react";
import { Provider } from "@/types";
export const dynamic = 'force-dynamic';
interface ProviderPageProps {
  searchParams: {
    search?: string;
    isOpen?: string;
    page?: string;
    limit?: string;
  };
}

export default async function ProvidersPage({
  searchParams,
}: ProviderPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = searchParams.search || "";
  const isOpen = searchParams.isOpen
    ? searchParams.isOpen === "true"
    : undefined;

  // Fetch providers with proper error handling
  const result = await providerService.getAllProviders(
    {
      search,
      isOpen,
      page,
      limit,
    },
    {
      cache: "no-store",
    }
  );


  const { data: providers, meta, error } = result;

  // Early return for error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-red-500 text-lg font-semibold">
              Failed to load providers
            </p>
            <p className="text-gray-600 mt-2">
              {error.message || "Something went wrong"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Check if meta exists
  if (!meta) {
    return (
      <div className="container mx-auto px-4 py-8">
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-yellow-600 text-lg font-semibold">
              Invalid response format
            </p>
            <p className="text-gray-600 mt-2">
              The server response is missing metadata
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="min-h-screen">
        {/* ================= HEADER ================= */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <span>🏪</span>
                Providers
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your food providers and restaurants
              </p>
            </div>
            {/* <ProviderDialog mode="create">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Provider
              </button>
            </ProviderDialog> */}
          </div>
        </section>

        {/* ================= STATS CARDS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Providers
                </p>
                <p className="text-2xl font-bold mt-1">{meta.total}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Open Now</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {providers.filter((p:Provider) => p.isOpen).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Closed</p>
                <p className="text-2xl font-bold mt-1 text-gray-600">
                  {providers.filter((p:Provider) => !p.isOpen).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Current Page
                </p>
                <p className="text-2xl font-bold mt-1">
                  {meta.page} / {meta.totalPages}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROVIDER TABLE ================= */}
        {providers.length > 0 ? (
          <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              }
            >
              <ProviderTable providers={providers} meta={meta} />
            </Suspense>
          </section>
        ) : (
          /* ================= EMPTY STATE ================= */
          <section className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {search || isOpen !== undefined
                  ? "No providers found"
                  : "No providers yet"}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {search || isOpen !== undefined
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first food provider or restaurant to manage your delivery network"}
              </p>
              {!search && isOpen === undefined && (
                <ProviderDialog mode="create">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Your First Provider
                  </button>
                </ProviderDialog>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}