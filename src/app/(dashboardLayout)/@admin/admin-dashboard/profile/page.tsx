import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import Link from "next/link";
import { ProfileForm } from "@/components/modules/authentication/profile-form";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Get profile
  const { data: profile, error } = await userService.getProfile();

  console.log("Admin Profile:", profile, error);

  // No session / not logged in
  if (error || !profile) {
    redirect("/login");
  }

  // Role-based protection
  if (profile.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {profile.name}!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin-dashboard/users"
            className="block rounded-lg border-2 border-indigo-200 bg-white p-6 shadow transition hover:border-indigo-400 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-indigo-100 p-3">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
                <p className="mt-1 text-sm text-gray-600">
                  View, edit, and delete users
                </p>
              </div>
            </div>
          </Link>

          <div className="rounded-lg border-2 border-gray-200 bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Role</h3>
                <p className="mt-1">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                    {profile.role}
                  </span>
                </p>
              </div>
            </div>
          </div>
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