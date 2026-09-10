import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(320),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  city: z.string().trim().min(1, "City is required").max(200),
  state: z.string().trim().min(1, "State is required").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  termsAccepted: z.literal(true, { message: "You must accept the Terms and Privacy Policy" }),
  marketingConsent: z.boolean().default(false),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});
