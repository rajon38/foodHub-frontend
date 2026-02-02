"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OrderTable } from "./order-table";

interface Order {
  id: string;
  customerId: string;
  customer?: {
    name: string;
    email: string;
  };
  providerId: string;
  provider?: {
    restaurantName: string;
  };
  deliveryAddress: string;
  paymentMethod: string;
  totalPrice: number;
  status: "PENDING" | "ACCEPTED" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";
  items: Array<{
    id: string;
    mealId: string;
    meal?: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

interface OrderTableWrapperProps {
  orders: Order[];
  pagination: PaginationMeta;
  showCustomer?: boolean;
  showProvider?: boolean;
  userRole?: "customer" | "provider" | "admin";
}

export function OrderTableWrapper({
  orders,
  pagination,
  showCustomer = false,
  showProvider = false,
  userRole = "customer",
}: OrderTableWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <OrderTable
      orders={orders}
      pagination={pagination}
      onPageChange={handlePageChange}
      showCustomer={showCustomer}
      showProvider={showProvider}
      userRole={userRole}
    />
  );
}