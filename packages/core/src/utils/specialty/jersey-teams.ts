/**
 * Jersey Frame Team Data - COMPLETE PRODUCTION DATA
 * 165 professional and college sports teams with official mat colors
 *
 * Structure: League → Teams → Team Mat Colors
 * - Users can select from team-specific mat colors plus universal black/white
 * - Each mat selection (top, bottom, backing) is independent
 *
 * Data Source: jerseyTeamsData.csv - Official team colors and mat SKU mappings
 * Last Updated: November 2025
 *
 * The CSV data has been converted to TypeScript and is imported from jersey-teams-data.ts
 * To regenerate: node scripts/generate-jersey-teams-data.js
 */

export interface MatOption {
  sku: string; // Mat SKU (e.g., "VB459", "VB221")
  hex: string; // Hex color code (e.g., "#97233F")
  name: string; // Display name (e.g., "Cardinal Red")
}

export interface JerseyTeam {
  id: string;
  name: string;
  displayName: string;
  colors: MatOption[]; // Available mat colors for this team (1-3 from CSV + black/white)
}

export interface JerseyLeague {
  id: string;
  name: string;
  teams: JerseyTeam[];
}

// Universal mat options available for all teams
export const UNIVERSAL_MAT_OPTIONS: MatOption[] = [
  { sku: "VB221", hex: "#000000", name: "Black" },
  { sku: "VB222", hex: "#FFFFFF", name: "White" },
];

/**
 * Import pre-generated jersey teams data
 * This data is generated from jerseyTeamsData.csv using scripts/generate-jersey-teams-data.js
 */
import { JERSEY_LEAGUES_DATA } from "./jersey-teams-data";

/**
 * All professional and college sports leagues with team mat color options
 * Generated from jerseyTeamsData.csv - contains 165+ teams across 9 leagues
 */
export const JERSEY_LEAGUES: JerseyLeague[] = JERSEY_LEAGUES_DATA;

/**
 * Helper functions for accessing team data
 */
export function getLeagueById(leagueId: string): JerseyLeague | undefined {
  return JERSEY_LEAGUES.find((league) => league.id === leagueId);
}

export function getTeamsByLeague(leagueId: string): JerseyTeam[] {
  const league = getLeagueById(leagueId);
  return league?.teams || [];
}

export function getTeamById(teamId: string): JerseyTeam | undefined {
  for (const league of JERSEY_LEAGUES) {
    const team = league.teams.find((t) => t.id === teamId);
    if (team) return team;
  }
  return undefined;
}

export function getMatOptionBySku(team: JerseyTeam, sku: string): MatOption | undefined {
  return team.colors.find((c) => c.sku === sku);
}
