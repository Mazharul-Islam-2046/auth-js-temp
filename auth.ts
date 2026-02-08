import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import authConfig from "./auth.config";
import { UserRepository } from "./server/db/user.repository";
import { AccountRepository } from "./server/db/account.repository";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await UserRepository.getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await AccountRepository.getAccountById(existingUser.id);



      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;

      return token;
    },

    async session({ session, token }) {
      return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            isOAuth: token.isOAuth,
          },
        } 
    },

    async signIn({ user, account }) {
      if(account?.provider !== "credentials") return true;

      if (!user.id) return false;

      const existingUser = await UserRepository.getUserById(user.id);

      if(!existingUser?.emailVerified) return false;

      return true
    },

  }
  
});
