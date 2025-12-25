import { z } from "zod";

// Step 1: Email validation
export const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Step 2: Reset code validation
export const resetCodeSchema = z.object({
  resetCode: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be numeric"),
});

// Step 3: New password validation
export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number, symbol and be at least 8 characters."
      ),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type EmailFormData = z.infer<typeof emailSchema>;
export type ResetCodeFormData = z.infer<typeof resetCodeSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
