import dataTeams from "@/data/teams.json";
import { db } from ".";
import { groups, NewGroup } from "./schema/groups";
import { GroupTeam, groupTeams, NewGroupTeam } from "./schema/groupTeams";
import { leagues } from "./schema/leagues";
import { matches, NewMatch } from "./schema/matches";
import { sports } from "./schema/sports";
import { NewStage, stages } from "./schema/stages";
import { teams } from "./schema/teams";

export default async function seed() {
  const dbTeams = await db
    .insert(teams)
    .values(
      dataTeams.map((team) => ({
        name: team.name,
        logo: team.logo,
      }))
    )
    .returning();

  const [sport] = await db
    .insert(sports)
    .values({ name: "Dota 2" })
    .returning();

  const [league] = await db
    .insert(leagues)
    .values({
      sportId: sport.id,
      name: "The International 2024",
    })
    .returning();
  const rawStages: NewStage[] = [
    {
      leagueId: league.id,
      name: "Group Stage",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-08-10"),
    },
    {
      leagueId: league.id,
      name: "Decider",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-08-10"),
    },
    {
      leagueId: league.id,
      name: "Main Event",
      startDate: new Date("2024-08-12"),
      endDate: new Date("2024-08-20"),
    },
  ];
  const dbStages = await db.insert(stages).values(rawStages).returning();
  const groupStage = dbStages.find((stage) => stage.name === "Group Stage");
  const mainEvent = dbStages.find((stage) => stage.name === "Main Event");
  const decider = dbStages.find((stage) => stage.name === "Decider");
  const rawGroups: NewGroup[] = [
    {
      stageId: groupStage!.id,
      name: "Group A",
    },
    {
      stageId: groupStage!.id,
      name: "Group B",
    },
    {
      stageId: decider!.id,
      name: "Decider",
    },
    {
      stageId: mainEvent!.id,
      name: "Lower Bracket Round 1",
      order: 0,
    },
    {
      stageId: mainEvent!.id,
      name: "Upper Bracket Quarterfinals",
      order: 1,
    },
    {
      stageId: mainEvent!.id,
      name: "Upper Bracket Semifinals",
      order: 5,
    },
    {
      stageId: mainEvent!.id,
      name: "Upper Bracket Final",
      order: 7,
    },
    {
      stageId: mainEvent!.id,
      name: "Lower Bracket Round 2",
      order: 3,
    },
    {
      stageId: mainEvent!.id,
      name: "Lower Bracket Round 3",
      order: 4,
    },
    {
      stageId: mainEvent!.id,
      name: "Lower Bracket Quarterfinals",
      order: 6,
    },
    {
      stageId: mainEvent!.id,
      name: "Lower Bracket Semifinals",
      order: 8,
    },
    {
      stageId: mainEvent!.id,
      name: "Lower Bracket Final",
      order: 9,
    },
    {
      stageId: mainEvent!.id,
      name: "Grand Final",
      order: 10,
    },
  ];
  const dbGroups = await db.insert(groups).values(rawGroups).returning();
  const groupA = dbGroups.find((group) => group.name === "Group A");
  const groupB = dbGroups.find((group) => group.name === "Group B");
  const rawGroupTeams: NewGroupTeam[] = dbTeams.map((team, index) => {
    return {
      teamId: team.id,
      groupId: index % 2 === 0 ? groupA!.id : groupB!.id,
    };
  });
  const dbGroupTeams = await db
    .insert(groupTeams)
    .values(rawGroupTeams)
    .returning();
  const groupATeams = dbGroupTeams.filter(
    (groupTeam) => groupTeam.groupId === groupA!.id
  );
  const groupBTeams = dbGroupTeams.filter(
    (groupTeam) => groupTeam.groupId === groupB!.id
  );
  const rawMatchesA = generateGroupMatches(groupATeams);
  const rawMatchesB = generateGroupMatches(groupBTeams);
  const completeMatches = [...rawMatchesA, ...rawMatchesB];
  const rawMatches: NewMatch[] = completeMatches.map((match) => {
    const teamA = dbTeams.find((team) => team.id === match.team1.teamId);
    const teamB = dbTeams.find((team) => team.id === match.team2.teamId);
    return {
      numberOfSets: 3,
      stageId: groupStage!.id,
      teamA: match.team1.teamId,
      teamB: match.team2.teamId,
      name: `${teamA?.name} vs ${teamB?.name}`,
      status: "not_started",
      scheduleAt: new Date("2024-08-01"),
      groupId: match.team1.groupId,
    };
  });
  await db.insert(matches).values(rawMatches).execute();
}

function generateGroupMatches(group: GroupTeam[]) {
  const matches = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      matches.push({
        team1: group[i],
        team2: group[j],
      });
    }
  }
  return matches;
}
