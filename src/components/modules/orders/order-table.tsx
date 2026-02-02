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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Trash2,
  Edit,
  Minus,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { orderUpdateStatus, orderUpdate, orderDelete } from "@/actions/order.action";
import { useRouter } from "next/navigation";

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
  status: "PENDING" | "ACCEPTED" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";
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
  userRole?: "customer" | "provider" | "admin";
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
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
  ON_THE_WAY: {
    label: "On the Way",
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

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "PREPARING", label: "Preparing" },
  { value: "ON_THE_WAY", label: "On the way" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function OrderTable({
  orders,
  pagination,
  onPageChange,
  showCustomer = false,
  showProvider = false,
  userRole = "customer",
}: OrderTableProps) {
  const router = useRouter();
  const { page, totalPages, totalItems } = pagination;
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Edit order states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [editDeliveryAddress, setEditDeliveryAddress] = useState("");
  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const canEditStatus = userRole === "provider" || userRole === "admin";
  const canDelete = userRole === "admin";
  const canEditOrder = userRole === "customer";

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    const toastId = toast.loading("Updating order status...");

    try {
      const { error } = await orderUpdateStatus(orderId, newStatus);

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Order status updated successfully!", { id: toastId });
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order status", { id: toastId });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting order...");

    try {
      const { error } = await orderDelete(orderToDelete);

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Order deleted successfully!", { id: toastId });
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete order", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (order: Order) => {
    setOrderToEdit(order);
    setEditDeliveryAddress(order.deliveryAddress);
    setEditItems(JSON.parse(JSON.stringify(order.items))); // Deep copy
    setEditDialogOpen(true);
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setEditItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const calculateEditTotal = () => {
    return editItems.reduce((sum, item) => {
      const itemPrice = item.meal?.price || item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  const handleUpdateOrder = async () => {
    if (!orderToEdit) return;

    if (!editDeliveryAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading("Updating order...");

    try {
      const updateData = {
        deliveryAddress: editDeliveryAddress.trim(),
        items: editItems.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
        })),
        totalPrice: calculateEditTotal(),
      };

      const { error } = await orderUpdate(orderToEdit.id, updateData);

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Order updated successfully!", { id: toastId });
      setEditDialogOpen(false);
      setOrderToEdit(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <>
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
                {(canDelete || canEditOrder) && (
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5 + (showCustomer ? 1 : 0) + (showProvider ? 1 : 0) + ((canDelete || canEditOrder) ? 1 : 0)}
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
                  const isUpdating = updatingStatus === order.id;
                  const canEdit = canEditOrder && order.status === "PENDING";

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
                        {canEditStatus ? (
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue>
                                <div className="flex items-center">
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusConfig[order.status].label}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => {
                                const OptionIcon = statusConfig[option.value as keyof typeof statusConfig].icon;
                                return (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center">
                                      <OptionIcon className="w-3 h-3 mr-2" />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant="outline"
                            className={`${statusConfig[order.status].color} border font-medium`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      {(canDelete || canEditOrder) && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(order)}
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(order.id)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order
              and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Order Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Order</DialogTitle>
            <DialogDescription>
              Update your order details. Only available while order is pending.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Order Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono">#{orderToEdit?.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{orderToEdit?.provider?.restaurantName}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-2">
              <Label htmlFor="edit-address" className="text-sm font-medium">
                Delivery Address *
              </Label>
              <Input
                id="edit-address"
                type="text"
                placeholder="Enter your complete delivery address"
                value={editDeliveryAddress}
                onChange={(e) => setEditDeliveryAddress(e.target.value)}
                required
              />
            </div>

            {/* Items */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Order Items</Label>
              <div className="space-y-3">
                {editItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.meal?.name || "Item"}</p>
                      <p className="text-xs text-gray-600">
                        ${(item.meal?.price || item.price).toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">New Total</span>
                <span className="font-bold text-xl text-orange-600">
                  ${calculateEditTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={isUpdating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateOrder}
                disabled={isUpdating}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isUpdating ? "Updating..." : "Update Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}