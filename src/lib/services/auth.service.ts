import { IRegisterRequest, IRegisterResponse } from "../interfaces/auth";
import { BASE_URL as API_BASE_URL } from "../constants/api";

const BASE_URL = `${API_BASE_URL}/auth`;

export async function registerService(body: IRegisterRequest) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data: IRegisterResponse = await response.json();
  if (!response.ok) {
    console.log("REGISTER SERVICE ERROR", data);
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

// ==================
// FORGOT PASSWORD
// ==================
export async function forgotPassword(email: string) {
  const response = await fetch(`${BASE_URL}/forgotPasswords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send reset code");
  }
  return data;
}

// ==================
// VERIFY RESET CODE
// ==================
export async function verifyResetCode(resetCode: string) {
  const response = await fetch(`${BASE_URL}/verifyResetCode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resetCode }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Invalid reset code");
  }
  return data;
}

// ==================
// RESET PASSWORD
// ==================
export async function resetPassword(email: string, newPassword: string) {
  const response = await fetch(`${BASE_URL}/resetPassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }
  return data;
}
