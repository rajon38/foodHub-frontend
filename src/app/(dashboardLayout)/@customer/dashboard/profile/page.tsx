import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
export const dynamic = 'force-dynamic';
export default async function ProfilePage() {
  const { data: profile, error } = await userService.getProfile();

  if (error || !profile) {
    redirect("/login");
  }


  if (profile.role !== "CUSTOMER") {
    redirect("/unauthorized"); // or "/"
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="mt-4 rounded-lg border p-4">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Email Verified:</strong>{" "}
          {profile.emailVerified ? "Yes ✅" : "No ❌"}
        </p>
      </div>
    </div>
  );
}
