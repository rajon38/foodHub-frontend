import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await userService.getSession();
    
    if (error) {
      return NextResponse.json({ data: null, error }, { status: 401 });
    }
    
    return NextResponse.json({ data, error: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: { message: "Failed to fetch session" } },
      { status: 500 }
    );
  }
}