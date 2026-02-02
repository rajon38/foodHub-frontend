"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Meal } from "@/types";
import { createOrder } from "@/actions/order.action";

interface OrderDialogProps {
  meal: Meal;
  children?: React.ReactNode;
}

export function OrderDialog({ meal, children }: OrderDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = meal.price * quantity;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating your order...");

    try {
      const orderData = {
        providerId: meal.provider?.id as string,
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod: "COD", // Default payment method
        items: [
          {
            mealId: meal.id,
            quantity: quantity,
          },
        ],
        totalPrice: totalAmount,
      };

      const { data, error } = await createOrder(orderData);

      if (error) {
        // Check if error is authentication related
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          toast.error("Please login to place an order", { id: toastId });
          router.push("/login");
          return;
        }

        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Order placed successfully! 🎉", { id: toastId });
      setOpen(false);
      setQuantity(1);
      setDeliveryAddress("");
      
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-orange-600 hover:bg-orange-700 w-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Place Your Order</DialogTitle>
          <DialogDescription>
            Complete the details below to order {meal.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Meal Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Price per item</span>
              <span className="font-medium text-gray-900">${meal.price.toFixed(2)}</span>
            </div>
            {meal.provider?.restaurantName && (
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Provider</span>
                <span className="font-medium text-gray-900">{meal.provider.restaurantName}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold">{quantity}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress" className="text-sm font-medium">
              Delivery Address *
            </Label>
            <Input
              id="deliveryAddress"
              type="text"
              placeholder="Enter your complete delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Delivery Fee</span>
              <span className="font-medium">TBD</span>
            </div>
            <div className="border-t border-orange-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl text-orange-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !meal.isAvailable}
            className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-base font-semibold"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Confirm Order
              </>
            )}
          </Button>

          {!meal.isAvailable && (
            <p className="text-sm text-red-600 text-center">
              This meal is currently unavailable
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}