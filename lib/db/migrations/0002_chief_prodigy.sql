CREATE TABLE IF NOT EXISTS "groupTeams" (
	"id" text PRIMARY KEY NOT NULL,
	"groupId" text NOT NULL,
	"teamId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN "available" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN "order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "stage" ADD COLUMN "startDate" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "stage" ADD COLUMN "endDate" timestamp NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupTeams" ADD CONSTRAINT "groupTeams_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupTeams" ADD CONSTRAINT "groupTeams_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
