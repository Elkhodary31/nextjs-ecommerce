import {
  IAddress,
  IAddressRequest,
  IAddressResponse,
} from "../interfaces/address";
import { BASE_URL as API_BASE_URL } from "../constants/api";

const BASE_URL = `${API_BASE_URL}/addresses`;

// ==================
// GET ALL ADDRESSES
// ==================
export async function getAllAddresses(token: string): Promise<IAddress[]> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      token: token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch addresses");
  }

  const data = (await res.json()) as IAddressResponse;
  return Array.isArray(data.data) ? data.data : [];
}

// ==================
// ADD ADDRESS
// ==================
export async function addAddress(
  token: string,
  address: IAddressRequest
): Promise<IAddress[]> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(address),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add address");
  }

  const data = (await res.json()) as IAddressResponse;
  return Array.isArray(data.data) ? data.data : [];
}

// ==================
// UPDATE ADDRESS
// ==================
export async function updateAddress(
  token: string,
  addressId: string,
  address: IAddressRequest
): Promise<IAddress> {
  const res = await fetch(`${BASE_URL}/${addressId}`, {
    method: "PUT",
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(address),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update address");
  }

  const data = (await res.json()) as IAddressResponse;
  return Array.isArray(data.data) ? data.data[0] : (data.data as IAddress);
}

// ==================
// DELETE ADDRESS
// ==================
export async function deleteAddress(
  token: string,
  addressId: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${addressId}`, {
    method: "DELETE",
    headers: {
      token: token,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete address");
  }
}
