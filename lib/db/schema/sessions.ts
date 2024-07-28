import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
