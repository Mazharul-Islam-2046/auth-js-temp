"use server"


import { signUpSchema } from "@/lib/zod";
import z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";



export const registerUser = async (data: z.infer<typeof signUpSchema>) => {
  try {
   const validatedData = signUpSchema.parse(data);

   if (!validatedData  || !validatedData.password) {
    console.log("Invalid input data")
     return {error: "Invalid input data"};
   }

   const { name, email, password, confirmPassword } = validatedData;

   if (password !== confirmPassword) {
        console.log("Password do not match")
        return {error: "Passwords do not match"};
   }


   const hashedPassword = await bcrypt.hash(password, 10);


   const userExists = await prisma.user.findUnique({
     where: { email },
   });

   if (userExists) {
    console.log("User already exists")
     return {error: "User already exists"};
   }

   const lowerCasedEmail = email.toLowerCase();

   const user = await prisma.user.create({
        data: {
          name,
          email: lowerCasedEmail,
          hashedPassword,

        },
   })


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