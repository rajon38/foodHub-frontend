"use server";

import { orderService, OrderData } from "@/services/orderService";
import { updateTag } from "next/cache";

export const createOrder = async (data: OrderData) => {
  const res = await orderService.createOrder(data);
  updateTag("categories");
  return res;
}

export const orderUpdateStatus = async (orderId: string, status: string) => {
  const res = await orderService.updateOrderStatus(orderId, status);
  updateTag("orders");
  return res;
}

export const orderUpdate = async (orderId: string, updateData: Partial<OrderData>) => {
  const res = await orderService.updateOrder(orderId, updateData);
  updateTag("orders");
  return res;
}

export const orderDelete = async (orderId: string) => {
  const res = await orderService.orderDelete(orderId);
  updateTag("orders");
  return res;
}