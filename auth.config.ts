import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "./lib/zod";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";



export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: profile.role || "user"
                }
            }
        }),
        Credentials({
            async authorize(credentials) {
                const validatedData = signInSchema.safeParse(credentials);
                if (!validatedData.success) return null;

                const { email, password } = validatedData.data;

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user || !user.hashedPassword) return null;

                const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
                if (!isPasswordValid) return null;

                return user;
            }
        })
    ]
} satisfies NextAuthConfig;