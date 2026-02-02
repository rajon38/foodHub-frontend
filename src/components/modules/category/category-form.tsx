"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/actions/category.action";

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
});

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
  };
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
}

export function CategoryForm({ category, mode = 'create', onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const isEditMode = mode === 'edit' && category;

  const form = useForm({
    defaultValues: {
      name: category?.name || '',
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading(
        isEditMode ? "Updating category..." : "Creating category..."
      );
      
      try {
        const { data, error } = isEditMode
          ? await updateCategory(category.id, value)
          : await createCategory(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success(
          isEditMode ? "Category updated successfully!" : "Category created successfully!",
          { id: toastId }
        );
        
        if (!isEditMode) {
          // Reset form only in create mode
          form.reset();
        }
        
        // Refresh to show updated data
        router.refresh();
        
        // Close dialog if callback provided
        onSuccess?.();
        
      } catch (error) {
        toast.error("Something went wrong. Please try again.", { id: toastId });
      }
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FieldGroup>
        {/* Category Name */}
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Category Name
                </FieldLabel>
                <input
                  type="text"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  placeholder="e.g., Pizza, Burgers, Desserts"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1 bg-orange-600 hover:bg-orange-700"
        >
          {isEditMode ? 'Update Category' : 'Create Category'}
        </Button>

        {!isEditMode && (
          <Button
            onClick={() => form.reset()}
            variant="outline"
            type="button"
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
}