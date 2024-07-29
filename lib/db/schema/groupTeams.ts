import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { teams } from "./teams";

export const groupTeams = pgTable("groupTeams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: text("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  teamId: text("teamId")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type GroupTeam = InferSelectModel<typeof groupTeams>;
export type NewGroupTeam = InferInsertModel<typeof groupTeams>;
