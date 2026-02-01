
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import Footer from "@/components/footer";
export default async function DashboardLayout({
  admin,
  provider,
  customer
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  provider: React.ReactNode;
  customer: React.ReactNode;
}) {
  const { data } = await userService.getSession();

  const userInfo = data.user;

  return (
    <>
    <NavbarWrapper/>
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {userInfo.role === Roles.admin ? admin :
           userInfo.role === Roles.provider ? provider :
           userInfo.role === Roles.customer ? customer :
           <div>Unauthorized Access</div>}
        </div>
      </SidebarInset>
    </SidebarProvider>
    <Footer />
    </>
  );
}