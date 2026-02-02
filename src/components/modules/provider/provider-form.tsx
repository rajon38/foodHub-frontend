"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateProvider } from "@/actions/provider.action";
import { Provider } from "@/types/provider.type";

const formSchema = z.object({
  restaurantName: z.string().min(2, { message: "Restaurant name must be at least 2 characters." }),
  description: z.string(),
  phone: z.string(),
  address: z.string(),
  isOpen: z.boolean(),
});

interface ProviderFormProps {
  provider?: Provider;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export function ProviderForm({
  provider,
  mode = "create",
  onSuccess,
}: ProviderFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit" && provider;

  const form = useForm({
    defaultValues: {
      restaurantName: provider?.restaurantName || "",
      description: provider?.description || "",
      phone: provider?.phone || "",
      address: provider?.address || "",
      isOpen: provider?.isOpen ?? true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading(
        isEditMode ? "Updating provider..." : "Creating provider..."
      );

      try {
        let res;
        if (isEditMode) {
          res = await updateProvider(provider.id, value);
          console.log("Update Provider Response:", res);
        } else {
          // Implement createProvider action when needed
          throw new Error("Create provider not implemented yet.");
        }

        const { data, error } = res;

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success(
          isEditMode
            ? "Provider updated successfully!"
            : "Provider created successfully!",
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
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Name Field */}
      <form.Field
        name="restaurantName"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field>
              <FieldLabel htmlFor={field.name}>Restaurant Name *</FieldLabel>
              <input
                type="text"
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g., Food Haven Restaurant"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      {/* Description Field */}
      {/* <form.Field
        name="description"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <textarea
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Brief description of the provider..."
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm resize-none"
            />
          </Field>
        )}
      /> */}

      {/* Phone Field */}
      <form.Field
        name="phone"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
            <input
              type="tel"
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g., +1 234 567 8900"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </Field>
        )}
      />

      {/* Address Field */}
      <form.Field
        name="address"
        children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Address</FieldLabel>
            <input
              type="text"
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g., 123 Main St, City, State"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </Field>
        )}
      />

      {/* Is Open Switch */}
      <form.Field
        name="isOpen"
        children={(field) => (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <FieldLabel htmlFor={field.name}>Provider Status</FieldLabel>
              <p className="text-sm text-gray-500">
                {field.state.value ? "Currently accepting orders" : "Temporarily closed"}
              </p>
            </div>
            <Switch
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
          </div>
        )}
      />

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
          {isEditMode ? "Update Provider" : "Create Provider"}
        </Button>
      </div>
    </form>
  );
}