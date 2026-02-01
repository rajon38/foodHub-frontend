import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    let isAuthenticated = false;
    let userRole: string | null = null;

    const { data } = await userService.getSession();

    if (data) {
        isAuthenticated = true;
        userRole = data.user.role;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based dashboard routing
    const isAdmin = userRole === Roles.admin;
    const isProvider = userRole === Roles.provider;
    const isCustomer = userRole === Roles.customer;

    // Admin trying to access other dashboards
    if (isAdmin && !pathName.startsWith("/admin-dashboard")) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }

    // Provider trying to access other dashboards
    if (isProvider && !pathName.startsWith("/provider-dashboard")) {
        return NextResponse.redirect(new URL("/provider-dashboard", request.url));
    }

    // Customer trying to access other dashboards
    if (isCustomer && !pathName.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Prevent non-admins from accessing admin dashboard
    if (!isAdmin && pathName.startsWith("/admin-dashboard")) {
        return NextResponse.redirect(new URL(
            isProvider ? "/provider-dashboard" : "/dashboard",
            request.url
        ));
    }

    // Prevent non-providers from accessing provider dashboard
    if (!isProvider && pathName.startsWith("/provider-dashboard")) {
        return NextResponse.redirect(new URL(
            isAdmin ? "/admin-dashboard" : "/dashboard",
            request.url
        ));
    }

    // Prevent non-customers from accessing customer dashboard
    if (!isCustomer && pathName.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL(
            isAdmin ? "/admin-dashboard" : "/provider-dashboard",
            request.url
        ));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/admin-dashboard",
        "/admin-dashboard/:path*",
        "/provider-dashboard",
        "/provider-dashboard/:path*"
    ],
};