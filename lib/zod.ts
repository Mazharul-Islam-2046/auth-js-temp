import { object, string } from "zod";

export const signInSchema = object({
  email: string({
    message: "Email is required",
  })
    .refine((value) => /^\S+@\S+$/.test(value), "Invalid email"),
  password: string({
    message: "Password is required",
  })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});



export const signUpSchema = object({
  name: string({
    message: "Name is required",
  }),
  email: string({
    message: "Email is required",
  })
    .refine((value) => /^\S+@\S+$/.test(value), "Invalid email"),
  password: string({
    message: "Password is required",
  })
    .min(1, "Password is required") 
  })