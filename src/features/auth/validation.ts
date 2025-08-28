import { z } from "zod";
export const loginSchema = z.object({
  email: z.email(),
  password: z.string({ error: "Password is required" }).nonempty("Password is required"),
});
export const registerSchema = z.object({
  name: z.string().min(2, "Name should be at least 3 character").nonempty("Name is required"),
  email: z.email().nonempty("Email is required"),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
