"use server";
import { signInSchema, signUpSchema } from "@/lib/zod";
import z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { handleAuthError } from "@/lib/utils";


export const registerUser = async (data: z.infer<typeof signUpSchema>) => {
  try {
    const validatedData = signUpSchema.parse(data);
    const { name, email, password, confirmPassword } = validatedData;

    if (password !== confirmPassword) return { error: "Passwords do not match" };

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return { error: "User already exists" };

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashedPassword: await bcrypt.hash(password, 10),
      },
    });

    if (!user) return { error: "Something went wrong during registration" };

  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }

  redirect("/auth/signin");
};

export const signInUser = async (data: z.infer<typeof signInSchema>) => {
  let email: string, password: string;

  try {
    const validatedData = signInSchema.parse(data);
    email = validatedData.email;
    password = validatedData.password;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.hashedPassword) return { error: "User not found" };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }


  return await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  }).catch(handleAuthError);
};

export const signOutUser = async () => {
  await signOut({ redirectTo: "/auth/signin" }).catch((error) => {
    throw error;
  });
};