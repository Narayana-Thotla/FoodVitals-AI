import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { PrismaClient, product } from "@prisma/client";
import { signOut } from "next-auth/react";

const prisma = new PrismaClient();

export const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "",
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      // console.log("inside the auth/[...nextauth]:", user, account, profile);

      if (account.provider == "github" || account.provider === "google") {
        const existingUser = await prisma.users.findUnique({
          where: {
            email: user.email,
          },
        });

        // console.log(existingUser);

        if (!existingUser) {
          const newUser = await prisma.users.create({
            data: {
              username: user.name,
              email: user.email,
              count: 0,
            },
          });
          // console.log("user created in authoptions:", newUser);
        }
      }
      return true;
    },
    // async signOut({ user, account, profile, email, credentials }: any) {
    //   return true;
    // },
    async session({ session, user }: any) {
      if (user) {
        // Adding custom session properties (if needed)
        session.user.id = user.id;
        session.user.count = user.count;
      }
      return session;
    },
  },
});

// export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
