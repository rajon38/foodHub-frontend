import { Route } from "@/types";

export const adminRoutes: Route[] = [
    {
      title: "Admin Management",
      items: [
        {
          title: "Dashboard",
          url: "/admin-dashboard",
        },
        {
          title: "Users",
          url: "/admin-dashboard/users",
        },
        {
          title: "Categories",
          url: "/admin-dashboard/categories",
        },
        {
          title: "Providers",
          url: "/admin-dashboard/providers",
        },
        {
          title: "Orders",
          url: "/admin-dashboard/order",
        },
      ],
    }
  ]