import { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { teams } from "./teams";

const matchStatusEnum = pgEnum("matchStatus", [
  "not_started",
  "in_progress",
  "finished",
]);

export const matches = pgTable("match", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  groupId: text("groupId").references(() => groups.id, {
    onDelete: "cascade",
  }),
  status: matchStatusEnum("matchStatus"),
  scheduleAt: timestamp("scheduleAt").notNull(),
  beginAt: timestamp("beginAt"),
  endAt: timestamp("endAt"),
  teamA: text("teamA")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  teamB: text("teamB")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  scoreTeamA: integer("scoreTeamA"),
  scoreTeamB: integer("scoreTeamB"),
  numberOfSets: integer("numberOfSets").notNull(),
  rescheduled: boolean("rescheduled").default(false),
  draw: boolean("draw").default(false),
  winnerId: text("winnerId").references(() => teams.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Match = InferSelectModel<typeof matches>;
export type NewMatch = InferInsertModel<typeof matches>;
