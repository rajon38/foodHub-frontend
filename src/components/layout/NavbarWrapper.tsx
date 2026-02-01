"use client";

import { Navbar } from "@/components/layout/Navber";
import { Roles } from "@/constants/roles";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function NavbarWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState("/dashboard");
  const pathname = usePathname();

  // Re-check authentication whenever pathname changes
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Expected JSON but got:", contentType);
        setIsAuthenticated(false);
        return;
      }

      const result = await response.json();
      const { data, error } = result;

      if (data && !error) {
        setIsAuthenticated(true);

        // Set dashboard URL based on user role
        const role = data.user.role;
        
        if (role === Roles.admin) {
          setDashboardUrl("/admin-dashboard");
        } else if (role === Roles.provider) {
          setDashboardUrl("/provider-dashboard");
        } else {
          setDashboardUrl("/dashboard");
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut(
        { fetchOptions : { 
          onSuccess: () => {
            setIsAuthenticated(false);
            window.location.href = "/login";
          },
          cache: "no-store"
        } }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }

  };

  return (
    <Navbar
      isAuthenticated={isAuthenticated}
      dashboardUrl={dashboardUrl}
      onLogout={handleLogout}
    />
  );
}