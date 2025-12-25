import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

function getSessionToken(): string | undefined {
  const secure = cookies().get("__Secure-next-auth.session-token")?.value;
  const standard = cookies().get("next-auth.session-token")?.value;
  return secure ?? standard;
}

export async function getMytoken() {
  const session = getSessionToken();
  const data = await decode({
    secret: process.env.NEXTAUTH_SECRET!,
    token: session || "",
  });
  return data?.token;
}

// Decode a raw JWT token string (e.g., the API token) without verification.
// Converts base64url payload -> JSON object.
export function decodeUserTokenPayload<T = any>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding =
      base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    const normalized = base64 + padding;
    const json = Buffer.from(normalized, "base64").toString("utf-8");
    const obj = JSON.parse(json) as T;
    return obj;
  } catch (e) {
    console.error("[decodeUserTokenPayload] failed:", e);
    return null;
  }
}

// Convenience: get decoded API token payload from session
export async function getDecodedUserToken<T = any>() {
  const raw = await getMytoken();
  if (!raw) return null;
  const decoded = decodeUserTokenPayload<T>(String(raw));
  console.log("[getDecodedUserToken] decoded:", decoded);
  return decoded;
}

export async function getUserIdFromToken() {
  const decoded = await getDecodedUserToken<{ id?: string }>();
  const id = decoded?.id ?? null;
  console.log("[getUserIdFromToken] id:", id);
  return id;
}
