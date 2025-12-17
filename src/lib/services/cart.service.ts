import { ICartResponse, IClearCartResponse } from "../interfaces/cart";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/cart";

// ==================
// ADD TO CART
// ==================
export async function addToCart(
  productId: string,
  token: string
): Promise<ICartResponse> {
  const startedAt = Date.now();
  console.log("[cart.service] addToCart:start", { productId });
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    console.log("[cart.service] addToCart:response", {
      status: res.status,
      ok: res.ok,
    });

    const data = (await res.json()) as ICartResponse;

    if (!res.ok) {
      console.error("[cart.service] addToCart:failed", {
        status: res.status,
        message: data?.message,
      });
      throw new Error("Failed to add to cart");
    }

    console.log("[cart.service] addToCart:success", {
      durationMs: Date.now() - startedAt,
      status: data.status,
      numOfCartItems: data.numOfCartItems,
      cartId: data.cartId,
    });

    return data;
  } catch (err) {
    console.error("[cart.service] addToCart:error", err);
    throw err;
  }
}

// ==================
// GET LOGGED USER CART
// ==================
export async function getCart(token: string): Promise<ICartResponse> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      token: token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return (await res.json()) as ICartResponse;
}

// ==================
// UPDATE CART ITEM QUANTITY
// ==================
export async function updateCartItemQuantity(
  productId: string,
  count: number,
  token: string
): Promise<ICartResponse> {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "PUT",
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ count: String(count) }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update cart");
  }

  return (await res.json()) as ICartResponse;
}

// ==================
// REMOVE CART ITEM
// ==================
export async function removeCartItem(
  productId: string,
  token: string
): Promise<ICartResponse> {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      token: token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to remove item");
  }

  return (await res.json()) as ICartResponse;
}

// ==================
// CLEAR CART
// ==================
export async function clearCart(token: string): Promise<IClearCartResponse> {
  const res = await fetch(BASE_URL, {
    method: "DELETE",
    headers: {
      token: token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to clear cart");
  }

  return (await res.json()) as IClearCartResponse;
}
