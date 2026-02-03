import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { ProfileForm } from "@/components/modules/authentication/profile-form";

export const dynamic = "force-dynamic";

export default async function ProviderPage() {
  // Get profile from auth service
  const { data: profile, error } = await userService.getProfile();

  // No session / not logged in
  if (error || !profile) {
    redirect("/login");
  }

  // Role-based protection
  if (profile.role !== "PROVIDER") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {profile.name}!</p>
        </div>

        {/* Profile Information */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Profile Information</h2>
          <div className="mb-6 grid gap-4 rounded-lg border p-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1 text-base text-gray-900">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-base text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1 text-base text-gray-900">{profile.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="mt-1">
                <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800">
                  {profile.role}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email Verified</p>
              <p className="mt-1 text-base text-gray-900">
                {profile.emailVerified ? "Yes ✅" : "No ❌"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Your Profile</h2>
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}