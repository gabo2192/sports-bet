import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { leagues } from "./leagues";

export const stageStatusEnum = pgEnum("stageStatus", [
  "active",
  "finished",
  "pending",
  "canceled",
]);

export const stages = pgTable("stage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  status: stageStatusEnum("stageStatus"),
  leagueId: text("leagueId")
    .notNull()
    .references(() => leagues.id, { onDelete: "cascade" }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Stage = InferSelectModel<typeof stages>;
export type NewStage = InferInsertModel<typeof stages>;
