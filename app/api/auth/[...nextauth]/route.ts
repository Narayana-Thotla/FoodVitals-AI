import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { authOptions } from "@/utils/authOptions";
import { PrismaClient, product } from "@prisma/client";
import { signOut } from "next-auth/react";

const prisma = new PrismaClient();

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
