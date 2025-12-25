"use server";

import { getMytoken } from "./getMyToken";

export async function getTokenAction() {
  try {
    const token = await getMytoken();
    return token as string;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}
