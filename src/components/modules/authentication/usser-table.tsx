"use client";

import { useState } from "react";
import { deleteUser } from "@/actions/user.action";

interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  role?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

interface UsersTableProps {
  initialUsers: User[]
  currentUserId: string;
}

export function UsersTable({ initialUsers, currentUserId }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDeleteClick = (userId: string) => {
    setDeletingUserId(userId);
    setError(null);
    setSuccess(null);
  };

  const handleCancelDelete = () => {
    setDeletingUserId(null);
  };

  const handleConfirmDelete = async (userId: string) => {
    setLoading(userId);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteUser(userId);

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess("User deleted successfully!");
        // Remove the user from the local state
        setUsers(users.filter((u) => u.id !== userId));
        setDeletingUserId(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "USER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Error</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800">
          <p className="font-semibold">Success</p>
          <p className="mt-1 text-sm">{success}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Created
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name || "N/A"}
                      </p>
                      {user.id === currentUserId && (
                        <span className="text-xs text-blue-600">(You)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-700">{user.email}</p>
                      {user.emailVerified && (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {user.phone || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role || "USER"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {formatDate(user.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {deletingUserId === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmDelete(user.id)}
                          disabled={loading === user.id}
                          className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {loading === user.id ? "Deleting..." : "Confirm"}
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          disabled={loading === user.id}
                          className="rounded bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-400 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        disabled={loading !== null || user.id === currentUserId}
                        className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        title={
                          user.id === currentUserId
                            ? "You cannot delete yourself"
                            : "Delete user"
                        }
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          Showing {users.length} {users.length === 1 ? "user" : "users"}
        </p>
      </div>
    </div>
  );
}