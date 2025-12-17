import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getMytoken() {
  const session = (await cookies().get("next-auth.session-token"))?.value;
  console.log("SESSION TOKEN IN GET MY TOKEN UTIL", session);
  const data = await decode({
    secret: process.env.AUTH_SECRET!,
    token: session || "",
  });
  console.log("DECODED DATA IN GET MY TOKEN UTIL", data);
  return data?.token;
}
