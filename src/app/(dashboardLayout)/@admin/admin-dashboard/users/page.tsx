import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { UsersTable } from "@/components/modules/authentication/usser-table";

export const dynamic = "force-dynamic";

export default async function UsersManagementPage() {
  // Get profile to check authorization
  const { data: profile, error } = await userService.getProfile();

  // No session / not logged in
  if (error || !profile) {
    redirect("/login");
  }

  // Role-based protection - only admins can access
  if (profile.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // Get all users
  const { data: users, error: usersError } = await userService.getAllUsers();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="mt-2 text-gray-600">Manage all users in the system</p>
            </div>
            <div className="rounded-lg bg-blue-50 px-6 py-3">
              <p className="text-sm font-medium text-blue-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{users?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg bg-white p-6 shadow">
          {usersError ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-800">
              <p className="font-semibold">Error loading users</p>
              <p className="mt-1 text-sm">{usersError.message}</p>
            </div>
          ) : (
            <UsersTable initialUsers={users || []} currentUserId={profile.id} />
          )}
        </div>
      </div>
    </div>
  );
}