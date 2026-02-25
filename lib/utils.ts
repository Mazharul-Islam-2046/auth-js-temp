import { clsx, type ClassValue } from "clsx"
import { AuthError } from "next-auth";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleAuthError = (error: unknown) => {
  if (error instanceof AuthError) {
    switch (error.type) {
      case "CredentialsSignin":
        return { error: "Invalid credentials" };
      default:
        return { error: "Please confirm your email" };
    }
  }
  throw error;
};


