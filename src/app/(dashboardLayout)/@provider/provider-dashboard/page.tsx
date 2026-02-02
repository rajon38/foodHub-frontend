import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
export default async function ProviderDashboard() {
  return redirect("/provider-dashboard/profile");
}
