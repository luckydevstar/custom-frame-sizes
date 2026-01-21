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
 * TODO: Handle CSV import - this may need to be moved to @framecraft/data
 * or the CSV needs to be processed at build time
 */

// NOTE: CSV import is commented out for now - needs to be handled differently in monorepo
// The CSV data should be processed and exported from @framecraft/data package
// import jerseyTeamsCSV from './jerseyTeamsData.csv?raw';

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
 * Parse CSV data and build team structure with mat options
 * TODO: This function should accept CSV string or be replaced with data from @framecraft/data
 */
function parseJerseyTeamsFromCSV(csvData?: string): JerseyLeague[] {
  // TODO: Get CSV data from @framecraft/data package or process at build time
  // For now, return empty array - this needs to be populated from the actual CSV data
  if (!csvData) {
    console.warn("Jersey teams CSV data not available - returning empty leagues array");
    return [];
  }

  const lines = csvData.trim().split("\n");
  const leagues: Map<string, JerseyLeague> = new Map();

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line - format: Sport,Team,Mat 1,HEX 1,Mat 2,HEX 2,Mat 3,HEX 3
    const parts = line.split(",");
    if (parts.length < 4) continue;

    const sport = parts[0].trim();
    const teamName = parts[1].trim();

    // Extract mat options (up to 3)
    const matOptions: MatOption[] = [];

    // Mat 1
    if (parts[2] && parts[3]) {
      const sku = parts[2].trim();
      const nameAndHex = parts[3].trim();
      const hexMatch = nameAndHex.match(/#([0-9A-Fa-f]{6})/);
      const hex = hexMatch ? "#" + hexMatch[1].toUpperCase() : "#000000";
      const name = nameAndHex.replace(/#[0-9A-Fa-f]{6}/, "").trim();

      if (sku && name) {
        matOptions.push({ sku, hex, name });
      }
    }

    // Mat 2
    if (parts[4] && parts[5]) {
      const sku = parts[4].trim();
      const nameAndHex = parts[5].trim();
      const hexMatch = nameAndHex.match(/#([0-9A-Fa-f]{6})/);
      const hex = hexMatch ? "#" + hexMatch[1].toUpperCase() : "#000000";
      const name = nameAndHex.replace(/#[0-9A-Fa-f]{6}/, "").trim();

      if (sku && name) {
        matOptions.push({ sku, hex, name });
      }
    }

    // Mat 3
    if (parts[6] && parts[7]) {
      const sku = parts[6].trim();
      const nameAndHex = parts[7].trim();
      const hexMatch = nameAndHex.match(/#([0-9A-Fa-f]{6})/);
      const hex = hexMatch ? "#" + hexMatch[1].toUpperCase() : "#000000";
      const name = nameAndHex.replace(/#[0-9A-Fa-f]{6}/, "").trim();

      if (sku && name) {
        matOptions.push({ sku, hex, name });
      }
    }

    // Add universal black and white if not already present
    const skus = new Set(matOptions.map((m) => m.sku));
    for (const universal of UNIVERSAL_MAT_OPTIONS) {
      if (!skus.has(universal.sku)) {
        matOptions.push(universal);
      }
    }

    // Create team ID and structure
    const leagueId = sport.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const teamId = `${leagueId}-${teamName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const team: JerseyTeam = {
      id: teamId,
      name: teamName.split(" ").pop() || teamName,
      displayName: teamName,
      colors: matOptions,
    };

    // Add to league
    if (!leagues.has(leagueId)) {
      leagues.set(leagueId, {
        id: leagueId,
        name: sport,
        teams: [],
      });
    }
    leagues.get(leagueId)!.teams.push(team);
  }

  return Array.from(leagues.values());
}

/**
 * All professional and college sports leagues with team mat color options
 * TODO: Initialize from CSV data via @framecraft/data package
 */
export let JERSEY_LEAGUES: JerseyLeague[] = [];

/**
 * Initialize jersey leagues from CSV data
 * This should be called during app initialization with data from @framecraft/data
 */
export function initializeJerseyTeams(csvData: string): void {
  JERSEY_LEAGUES = parseJerseyTeamsFromCSV(csvData);
}

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
