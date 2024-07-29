ALTER TABLE "match" RENAME COLUMN "numberOfSets" TO "test";--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "test" SET DATA TYPE text;