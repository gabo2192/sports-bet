import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import CustomAdapter from "./db/auth/adapter";
import { sendVerificationRequest } from "./mail";

export const secret = process.env.NEXTAUTH_SECRET!;

export const authOptions = {
  adapter: CustomAdapter(db) as any,
  providers: [
    EmailProvider({
      from: process.env.MAIL_FROM_EMAIL!,
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {},
} satisfies NextAuthOptions;
