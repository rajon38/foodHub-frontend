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
import { CategoryForm } from "./category-form";
import { Category } from "@/types/category.type";

interface CategoryDialogProps {
  children: React.ReactNode;
  mode: "create" | "edit";
  category?: Category;
}

export function CategoryDialog({ children, mode, category }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "edit" ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "edit"
              ? "Update your category details"
              : "Add a new category to organize your items"}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          mode={mode}
          category={category}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}