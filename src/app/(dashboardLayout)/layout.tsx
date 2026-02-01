import { AppSidebar } from "@/components/layout/app-sidebar";
import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/footer";

export default async function DashboardLayout({
  children,
  admin,
  provider,
  customer,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  provider: React.ReactNode;
  customer: React.ReactNode;
}) {
  const { data } = await userService.getSession();

  // Redirect to login if not authenticated
  if (!data) {
    redirect("/login");
  }

  const userInfo = data.user;

  // Determine which content to show based on role
  let dashboardContent;
  if (userInfo.role === Roles.admin) {
    dashboardContent = admin;
  } else if (userInfo.role === Roles.provider) {
    dashboardContent = provider;
  } else if (userInfo.role === Roles.customer) {
    dashboardContent = customer;
  } else {
    dashboardContent = children;
  }

  return (
    <main>
    <NavbarWrapper/>
    <SidebarProvider >
      <AppSidebar user={userInfo} />
      <SidebarInset >
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {dashboardContent}
        </div>
      </SidebarInset>
    </SidebarProvider>
    <Footer />
    </main>
  );
}