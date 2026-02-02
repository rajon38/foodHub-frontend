import { orderService } from "@/services/orderService";
import { OrderTableWrapper } from "@/components/modules/orders/order-table-wrapper";
import { redirect } from "next/navigation";// Adjust import based on your auth implementation
import { userService } from "@/services/user.service";
import { Roles } from "@/constants/roles";

interface AdminOrderPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function AdminOrderPage({ searchParams }: AdminOrderPageProps) {
  // Get role and verify admin role
  const { data: profile } = await userService.getProfile();

  if (!profile || profile.role !== Roles.admin) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 10;

  // Fetch all orders (admin can see everything)
  const { data, meta, error } = await orderService.getAllOrders({
    page,
    limit,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Orders</h1>
        <p className="text-gray-600">
          Manage and monitor all orders across the platform
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-800 font-medium">Failed to load orders</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      ) : (
        <OrderTableWrapper
          orders={data || []}
          pagination={meta || { page: 1, limit: 10, totalPages: 1, totalItems: 0 }}
          showCustomer={true}
          showProvider={true}
        />
      )}
    </div>
  );
}