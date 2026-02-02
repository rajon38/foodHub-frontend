"use server";

import { providerService, ProviderUpdateData } from "@/services/provider.service";
import { updateTag } from "next/cache";

export const updateProvider = async (id: string, data: ProviderUpdateData) => {
  const res = await providerService.updateProvider(id, data);
  updateTag("providers");
  return res;
}
