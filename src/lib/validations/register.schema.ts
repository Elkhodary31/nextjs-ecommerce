import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(3, "Name must be at least 3 characters long"),
    lastName: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number, symbol and be at least 8 characters."
      ),
    rePassword: z.string().min(6, "Re-entered password must be as password"),
    phone: z.string().regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
