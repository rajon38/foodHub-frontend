"use server";

import { orderService, OrderData } from "@/services/orderService";
import { updateTag } from "next/cache";

export const createOrder = async (data: OrderData) => {
  const res = await orderService.createOrder(data);
  updateTag("categories");
  return res;
}