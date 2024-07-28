"use client";
import { SessionProvider as NextAuthSession } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSession>{children}</NextAuthSession>;
}
