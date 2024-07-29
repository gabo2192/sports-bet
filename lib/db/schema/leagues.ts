import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sports } from "./sports";

export const leagues = pgTable("league", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  sportId: text("sportId")
    .notNull()
    .references(() => sports.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type League = InferSelectModel<typeof leagues>;
export type NewLeague = InferInsertModel<typeof leagues>;
