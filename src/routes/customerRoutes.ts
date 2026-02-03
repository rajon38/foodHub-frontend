import { Route } from "@/types";

export const customerRoutes: Route[] = [
    {
      title: "Customer Management",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Orders",
          url: "/dashboard/order",
        }
      ],
    }
  ]