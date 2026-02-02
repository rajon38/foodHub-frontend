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
import { ProviderForm } from "./provider-form";
import { Provider } from "@/types/provider.type";

interface ProviderDialogProps {
  children: React.ReactNode;
  mode: "create" | "edit";
  provider?: Provider;
}

export function ProviderDialog({
  children,
  mode,
  provider,
}: ProviderDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "edit" ? "Edit Provider" : "Create New Provider"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update provider information"
              : "Add a new provider to your system"}
          </DialogDescription>
        </DialogHeader>
        <ProviderForm
          mode={mode}
          provider={provider}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}