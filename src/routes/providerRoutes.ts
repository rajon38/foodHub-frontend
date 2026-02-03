import { Route } from "@/types";

export const providerRoutes: Route[] = [
    {
      title: "Provider Management",
      items: [
        {
          title: "Dashboard",
          url: "/provider-dashboard",
        },
        {
            title: "Resturent Profile",
            url: "/provider-dashboard/resturent",
        },
        {
          title: "Meals",
          url: "/provider-dashboard/meal",
        },
        {
          title: "Orders",
          url: "/provider-dashboard/order",
        },
      ],
    }
  ]