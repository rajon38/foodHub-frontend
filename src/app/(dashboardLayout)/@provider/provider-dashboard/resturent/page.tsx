import { providerService } from "@/services/provider.service";
import { userService } from "@/services/user.service";
import { ProviderForm } from "@/components/modules/provider/provider-form";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";

export const dynamic = "force-dynamic";

export default async function ProviderSetupPage() {
  // Get user profile
  const { data: profile } = await userService.getProfile();

  // Check if user is logged in and has provider role
  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== Roles.provider) {
    redirect("/");
  }

  // Try to fetch existing provider profile
  let provider = null;
  let mode: "create" | "edit" = "create";

  if (profile.providerProfile?.id) {
    const { data } = await providerService.getProviderById(profile.providerProfile.id);
    if (data) {
      provider = data;
      mode = "edit";
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === "edit" ? "Edit Provider Profile" : "Create Provider Profile"}
        </h1>
        <p className="text-gray-600">
          {mode === "edit"
            ? "Update your restaurant information and settings"
            : "Set up your restaurant profile to start accepting orders"}
        </p>
      </div>

      {/* Form */}
      <ProviderForm provider={provider} mode={mode} />
    </div>
  );
}