import {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters";
import { and, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { DefaultUser } from "next-auth";
import { accounts } from "../schema/accounts";
import { authenticators } from "../schema/authenticators";
import { sessions } from "../schema/sessions";
import { users } from "../schema/users";
import { verificationTokens } from "../schema/verification-tokens";

declare module "next-auth" {
  export interface User extends DefaultUser {
    stripeId: string | null;
    beehiivId: string | null;
  }
  // export interface Session extends DefaultSession {
  //   user?: {
  //     id: string;
  //     role: "FREE" | "PREMIUM" | "ADMIN";
  //     email: string;
  //     name?: string;
  //     image?: string;
  //     wallets: string[];
  //   };
  // }
}

export default function CustomAdapter(
  db:
    | PostgresJsDatabase<Record<string, never>>
    | VercelPgDatabase<Record<string, never>>
): Adapter {
  return {
    createUser: async (userData) => {
      const [user] = await db
        .insert(users)
        .values({
          email: userData.email,
          name: userData.name,
          emailVerified: userData.emailVerified,
          image: userData.image,
        })
        .returning();
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      };
    },
    async getUser(userId: string) {
      return db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .then((res) => (res.length > 0 ? res[0] : null));
    },
    async getUserByEmail(email: string) {
      return db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((res) => (res.length > 0 ? res[0] : null));
    },
    async createSession(data: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      return db
        .insert(sessions)
        .values(data)
        .returning()
        .then((res) => res[0]);
    },
    async getSessionAndUser(sessionToken: string) {
      return db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => (res.length > 0 ? res[0] : null));
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.");
      }

      const [result] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning();

      if (!result) {
        throw new Error("No user found.");
      }

      return result;
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      return db
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0]);
    },
    async linkAccount(data: AdapterAccount) {
      await db.insert(accounts).values(data);
    },
    async getUserByAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      const result = await db
        .select({
          account: accounts,
          user: users,
        })
        .from(accounts)
        .innerJoin(users, eq(accounts.userId, users.id))
        .where(
          and(
            eq(accounts.provider, account.provider),
            eq(accounts.providerAccountId, account.providerAccountId)
          )
        )
        .then((res) => res[0]);

      return result?.user ?? null;
    },
    async deleteSession(sessionToken: string) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
    async createVerificationToken(data: VerificationToken) {
      return db
        .insert(verificationTokens)
        .values(data)
        .returning()
        .then((res) => res[0]);
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      return db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, params.identifier),
            eq(verificationTokens.token, params.token)
          )
        )
        .returning()
        .then((res) => (res.length > 0 ? res[0] : null));
    },
    async deleteUser(id: string) {
      await db.delete(users).where(eq(users.id, id));
    },
    async unlinkAccount(
      params: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.provider, params.provider),
            eq(accounts.providerAccountId, params.providerAccountId)
          )
        );
    },
    async getAccount(providerAccountId: string, provider: string) {
      return db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId)
          )
        )
        .then((res) => res[0] ?? null) as Promise<AdapterAccount | null>;
    },
    async createAuthenticator(data: AdapterAuthenticator) {
      return db
        .insert(authenticators)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null);
    },
    async getAuthenticator(credentialID: string) {
      return db
        .select()
        .from(authenticators)
        .where(eq(authenticators.credentialID, credentialID))
        .then((res) => res[0] ?? null);
    },
    async listAuthenticatorsByUserId(userId: string) {
      return db
        .select()
        .from(authenticators)
        .where(eq(authenticators.userId, userId))
        .then((res) => res);
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const authenticator = await db
        .update(authenticators)
        .set({ counter: newCounter })
        .where(eq(authenticators.credentialID, credentialID))
        .returning()
        .then((res) => res[0]);

      if (!authenticator) throw new Error("Authenticator not found.");

      return authenticator;
    },
  };
}
