import { IRegisterRequest, IRegisterResponse } from "../interfaces/auth";

export async function registerService(body: IRegisterRequest) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data: IRegisterResponse = await response.json();
  if (!response.ok) {
    console.log("REGISTER SERVICE ERROR", data);
    throw new Error(data.message || "Registration failed");
  }
  return data;
}
