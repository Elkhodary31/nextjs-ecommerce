"use server";

import { getUserIdFromToken } from "@/app/utilities/getMyToken";

export async function getUserIdFromServer() {
  const userId = await getUserIdFromToken();
  return userId;
}
