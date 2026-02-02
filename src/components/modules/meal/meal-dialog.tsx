"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createMeal, updateMeal } from "@/actions/meal.action";
import { Upload, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId: string;
  image?: string;
}

interface MealFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: Meal | null;
  categories: Category[];
}

export function MealFormDialog({
  open,
  onOpenChange,
  meal,
  categories,
}: MealFormDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isAvailable: true,
    categoryId: "",
    image: "",
  });

  const isEditing = !!meal;

  // Reset form when dialog opens/closes or meal changes
  useEffect(() => {
    if (open && meal) {
      setFormData({
        name: meal.name,
        description: meal.description,
        price: meal.price.toString(),
        isAvailable: meal.isAvailable,
        categoryId: meal.categoryId,
        image: meal.image || "",
      });
    } else if (!open) {
      setFormData({
        name: "",
        description: "",
        price: "",
        isAvailable: true,
        categoryId: "",
        image: "",
      });
    }
  }, [open, meal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a meal name");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(isEditing ? "Updating meal..." : "Creating meal...");

    try {
      const mealData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
        categoryId: formData.categoryId,
        ...(formData.image && { image: formData.image }),
      };

      const { data, error } = isEditing
        ? await updateMeal(meal.id, mealData)
        : await createMeal(mealData);

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success(
        isEditing ? "Meal updated successfully! 🎉" : "Meal created successfully! 🎉",
        { id: toastId }
      );
      
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Meal" : "Create New Meal"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the meal details below"
              : "Fill in the details to add a new meal to your menu"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Meal Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Meal Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Grilled Chicken Sandwich"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your meal..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price ($) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category *
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Image URL (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="url"
                placeholder="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              {formData.image && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, image: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formData.image && (
              <div className="mt-2 rounded-lg border overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                  }}
                />
              </div>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="availability" className="text-sm font-medium">
                Availability
              </Label>
              <p className="text-xs text-gray-600">
                Make this meal available for ordering
              </p>
            </div>
            <Switch
              id="availability"
              checked={formData.isAvailable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isAvailable: checked })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update Meal" : "Create Meal"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}