import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { stages } from "./stages";

export const groups = pgTable("group", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  stageId: text("stageId")
    .notNull()
    .references(() => stages.id, { onDelete: "cascade" }),
  available: boolean("available").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;
