"use server";

import { signInSchema, signUpSchema } from "@/lib/zod";
import z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export const registerUser = async (data: z.infer<typeof signUpSchema>) => {
  try {
    const validatedData = signUpSchema.parse(data);

    if (!validatedData) {
      console.log("Invalid input data");
      return { error: "Invalid input data" };
    }

    const { name, email, password, confirmPassword } = validatedData;

    if (password !== confirmPassword) {
      console.log("Password do not match");
      return { error: "Passwords do not match" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      console.log("User already exists");
      return { error: "User already exists" };
    }

    const lowerCasedEmail = email.toLowerCase();

    const user = await prisma.user.create({
      data: {
        name,
        email: lowerCasedEmail,
        hashedPassword,
      },
    });

    if (!user) {
      console.log("Something went wrong during registration");
      return { error: "Something went wrong during registration" };
    }

    return { success: "User registered successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};

// Sign In Action
export const signInUser = async (data: z.infer<typeof signInSchema>) => {
  try {
    const validatedData = signInSchema.parse(data);
    if (!validatedData) {
      console.log("Invalid input data");
      return { error: "Invalid input data" };
    }

    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.hashedPassword) {
      console.log("User not found");
      return { error: "User not found" };
    }

    try {
      await signIn("credentials", {
        email: user.email,
        password: password,
        redirectTo: "/register",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials" };
          default:
              return { error: "Please Confirm your email" };
        }

      }
    }

    return { success: "User signed in successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};



// sign out action
export const signOutUser = async () => {
  try {
    await signOut({ redirectTo: "/signin" });
    return { success: "User signed out successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};
