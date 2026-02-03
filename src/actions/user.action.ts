"use server";

import { userService, UserUpdateData,  } from "@/services/user.service";
import { updateTag } from "next/cache";

export const updateProfile = async (data: UserUpdateData) => {
  const res = await userService.updateProfile(data);
    updateTag("users");
  return res;
}

export const deleteUser = async (id: string) => {
  const res = await userService.deleteUser(id);
    updateTag("users");
  return res;
}