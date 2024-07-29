DO $$ BEGIN
 CREATE TYPE "public"."stageStatus" AS ENUM('active', 'finished', 'pending', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 CREATE TYPE "public"."matchStatus" AS ENUM('not_started', 'in_progress', 'finished');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"stageId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "league" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"sportId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "match" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"groupId" text,
	"matchStatus" "matchStatus",
	"scheduleAt" timestamp NOT NULL,
	"beginAt" timestamp,
	"endAt" timestamp,
	"teamA" text NOT NULL,
	"teamB" text NOT NULL,
	"scoreTeamA" integer,
	"scoreTeamB" integer,
	"numberOfSets" text NOT NULL,
	"rescheduled" boolean DEFAULT false,
	"draw" boolean DEFAULT false,
	"winnerId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matchResult" (
	"id" text PRIMARY KEY NOT NULL,
	"matchId" text NOT NULL,
	"scoreTeamA" integer,
	"scoreTeamB" integer,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sport" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stage" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"stageStatus" "stageStatus",
	"leagueId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"logo" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group" ADD CONSTRAINT "group_stageId_stage_id_fk" FOREIGN KEY ("stageId") REFERENCES "public"."stage"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "league" ADD CONSTRAINT "league_sportId_sport_id_fk" FOREIGN KEY ("sportId") REFERENCES "public"."sport"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_teamA_team_id_fk" FOREIGN KEY ("teamA") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_teamB_team_id_fk" FOREIGN KEY ("teamB") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_winnerId_team_id_fk" FOREIGN KEY ("winnerId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matchResult" ADD CONSTRAINT "matchResult_matchId_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stage" ADD CONSTRAINT "stage_leagueId_league_id_fk" FOREIGN KEY ("leagueId") REFERENCES "public"."league"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
