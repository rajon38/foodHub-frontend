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