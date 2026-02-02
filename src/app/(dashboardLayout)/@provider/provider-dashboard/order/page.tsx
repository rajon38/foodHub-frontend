import { orderService } from "@/services/orderService";
import { OrderTableWrapper } from "@/components/modules/orders/order-table-wrapper";
import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Roles } from "@/constants/roles";

export const dynamic = 'force-dynamic';
interface ProviderOrderPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ProviderOrderPage({ searchParams }: ProviderOrderPageProps) {
  // Get session and verify provider role
  const { data: profile } = await userService.getProfile();
  
    if (!profile || profile.role !== Roles.provider) {
      redirect("/login");
    }

  const providerId = profile.providerProfile.id;

  if (!providerId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
          <p className="text-yellow-800 font-medium">Provider account not found</p>
          <p className="text-yellow-600 text-sm mt-1">
            Please complete your provider profile setup.
          </p>
        </div>
      </div>
    );
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 10;

  // Fetch orders for this provider only
  const { data, meta, error } = await orderService.getAllOrders({
    providerId: providerId, // Use provider ID from session
    page,
    limit,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Orders</h1>
        <p className="text-gray-600">
          Manage incoming orders for your restaurant
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-800 font-medium">Failed to load orders</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      ) : data && data.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-orange-100 p-4">
              <svg
                className="w-12 h-12 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-4">
                Orders from customers will appear here when they place them.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <OrderTableWrapper
          orders={data || []}
          pagination={meta || { page: 1, limit: 10, totalPages: 1, totalItems: 0 }}
          showCustomer={true} // Show customer information for provider
          showProvider={false} // Don't show provider column since all orders belong to this provider
        />
      )}
    </div>
  );
}