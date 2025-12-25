import { IWishlistAddRemove, IWishlistResponse } from "../interfaces/wishlist";
import { BASE_URL as API_BASE_URL } from "../constants/api";

const BASE_URL = `${API_BASE_URL}/wishlist`;

// ==================
// GET WISHLIST
// ==================
export async function getWishList(token: string): Promise<IWishlistResponse> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      token: token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return (await res.json()) as IWishlistResponse;
}

// ==================
// ADD TO WISHLIST
// ==================
export async function addToWishlist(
  productId: string,
  token: string
): Promise<IWishlistAddRemove> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  const body = await res.json();
  console.log("Add", body);

  if (!res.ok) {
    throw new Error(body?.message || "Failed to add to wishlist");
  }

  return body as IWishlistAddRemove;
}

// ==================
// REMOVE FROM WISHLIST
// ==================
export async function removeFromWishlist(
  productId: string,
  token: string
): Promise<IWishlistAddRemove> {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      token: token,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || "Failed to remove from wishlist");
  }

  return body as IWishlistAddRemove;
}
