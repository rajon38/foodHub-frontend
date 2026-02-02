import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  return redirect("/admin-dashboard/profile");
}
