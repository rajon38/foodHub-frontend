"use server";

import { updateTag } from "next/cache";

import { reviewService, ReviewCreateData } from "@/services/review.service";

export const createReview = async (data: ReviewCreateData) => {
  const res = await reviewService.createReview(data);
  updateTag("reviews");
  return res;
}

export const updateReview = async (id: string, data: Partial<ReviewCreateData>) => {
  const res = await reviewService.updateReview(id, data);
  updateTag("reviews");
  return res;
}
export const deleteReview = async (id: string) => {
  const res = await reviewService.deleteReview(id);
  updateTag("reviews");
  return res;
}