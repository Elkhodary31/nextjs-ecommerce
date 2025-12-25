import { BASE_URL } from "@/lib/constants/api";
import { IOrder } from "@/lib/interfaces/order";

export async function getUserOrders(
  userId: string,
  token: string
): Promise<IOrder[]> {
  const res = await fetch(`${BASE_URL}/orders/user/${userId}`, {
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[order.service] getUserOrders failed",
      res.status,
      res.statusText
    );
    throw new Error("Failed to load orders");
  }

  const data = await res.json();
  if (Array.isArray(data)) return data as IOrder[];
  if (Array.isArray((data as any)?.data)) return (data as any).data as IOrder[];
  return [];
}

export async function createCheckoutSession(
  cartId: string,
  shippingAddress: { details: string; phone: string; city: string },
  token: string,
  redirectUrl: string = window.location.origin
): Promise<{ session: { url: string } }> {
  const res = await fetch(
    `${BASE_URL}/orders/checkout-session/${cartId}?url=${redirectUrl}`,
    {
      method: "POST",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shippingAddress }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create checkout session");
  }

  return await res.json();
}

export async function createCashOrder(
  cartId: string,
  shippingAddressId: string,
  token: string
): Promise<{ data: IOrder }> {
  const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
    method: "POST",
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shippingAddress: shippingAddressId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create order");
  }

  return await res.json();
}
