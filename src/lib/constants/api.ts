// Prefer environment override; fall back to production API
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  "https://ecommerce.routemisr.com/api/v1";
