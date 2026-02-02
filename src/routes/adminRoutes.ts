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
          title: "Categories",
          url: "/admin-dashboard/categories",
        }
      ],
    }
  ]