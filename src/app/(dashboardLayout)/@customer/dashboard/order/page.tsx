import { orderService } from "@/services/orderService";
import { OrderTableWrapper } from "@/components/modules/orders/order-table-wrapper";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";

interface CustomerOrderPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CustomerOrderPage({ searchParams }: CustomerOrderPageProps) {
  const { data: profile } = await userService.getProfile();

  if (!profile || profile.role !== Roles.customer) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 10;

  const { data, meta, error } = await orderService.getAllOrders({
    customerId: profile.id,
    page,
    limit,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track and manage your food orders
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start exploring delicious meals and place your first order!
              </p>
              <a
                href="/meals"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Browse Meals
              </a>
            </div>
          </div>
        </div>
      ) : (
        <OrderTableWrapper
          orders={data || []}
          pagination={meta || { page: 1, limit: 10, totalPages: 1, totalItems: 0 }}
          showCustomer={false} // Don't show customer column since all orders belong to this customer
          showProvider={true} // Show which provider the order is from
        />
      )}
    </div>
  );
}