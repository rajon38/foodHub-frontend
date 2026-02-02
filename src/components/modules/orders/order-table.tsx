"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  mealId: string;
  meal?: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

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
  status: "PENDING" | "CONFIRMED" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

interface OrderTableProps {
  orders: Order[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  showCustomer?: boolean;
  showProvider?: boolean;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: CheckCircle2,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-teal-100 text-teal-800 border-teal-300",
    icon: CheckCircle2,
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: Package,
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
  },
};

export function OrderTable({
  orders,
  pagination,
  onPageChange,
  showCustomer = false,
  showProvider = false,
}: OrderTableProps) {
  const { page, totalPages, totalItems } = pagination;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const getItemsSummary = (items: OrderItem[]) => {
    if (items.length === 0) return "No items";
    if (items.length === 1) {
      return `${items[0].meal?.name || "Item"} x${items[0].quantity}`;
    }
    return `${items.length} items (${items.reduce((sum, item) => sum + item.quantity, 0)} total)`;
  };

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="space-y-4">
      {/* Orders Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {orders.length > 0 ? (page - 1) * pagination.limit + 1 : 0} to{" "}
          {Math.min(page * pagination.limit, totalItems)} of {totalItems} orders
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Order ID</TableHead>
              {showCustomer && (
                <TableHead className="font-semibold text-gray-900">Customer</TableHead>
              )}
              {showProvider && (
                <TableHead className="font-semibold text-gray-900">Provider</TableHead>
              )}
              <TableHead className="font-semibold text-gray-900">Items</TableHead>
              <TableHead className="font-semibold text-gray-900">Total</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Payment</TableHead>
              <TableHead className="font-semibold text-gray-900">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5 + (showCustomer ? 1 : 0) + (showProvider ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Package className="w-12 h-12 text-gray-300" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm">Orders will appear here once they are placed</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    {showCustomer && (
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {order.customer?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.customer?.email || ""}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {showProvider && (
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {order.provider?.restaurantName || "Unknown Provider"}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {getItemsSummary(order.items)}
                        </span>
                        {order.items.length > 1 && (
                          <span className="text-xs text-gray-500">
                            {order.items.map((item) => item.meal?.name).join(", ")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${statusConfig[order.status].color} border font-medium`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {order.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={!canGoPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={!canGoPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={!canGoNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={!canGoNext}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}