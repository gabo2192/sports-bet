import { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { matches } from "./matches";

export const matchResults = pgTable("matchResult", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matchId: text("matchId")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  scoreTeamA: integer("scoreTeamA"),
  scoreTeamB: integer("scoreTeamB"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type MatchResult = InferSelectModel<typeof matchResults>;
export type NewMatchResult = InferInsertModel<typeof matchResults>;
