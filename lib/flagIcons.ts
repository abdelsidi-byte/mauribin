// Map country/team names to ISO 3166-1 alpha-2 codes for flag-icons
const COUNTRY_ISO_MAP: Record<string, string> = {
  // Arab countries
  Morocco: "ma", Tunisia: "tn", Algeria: "dz", Egypt: "eg", Iraq: "iq",
  Jordan: "jo", Qatar: "qa", UAE: "ae", "Saudi Arabia": "sa", Oman: "om",
  Bahrain: "bh", Kuwait: "kw", Yemen: "ye", Syria: "sy", Libya: "ly",
  Sudan: "sd", Palestine: "ps", Lebanon: "lb", Mauritania: "mr",
  // Europe
  France: "fr", Germany: "de", Spain: "es", England: "gb-eng", Italy: "it",
  Portugal: "pt", Netherlands: "nl", Belgium: "be", Switzerland: "ch",
  Croatia: "hr", Denmark: "dk", Sweden: "se", Poland: "pl", Ukraine: "ua",
  "Czech Republic": "cz", Czechia: "cz", Hungary: "hu", Serbia: "rs",
  Austria: "at", Wales: "gb-wls", Scotland: "gb-sct",
  // South America
  Brazil: "br", Argentina: "ar", Uruguay: "uy", Chile: "cl", Colombia: "co",
  Peru: "pe", Venezuela: "ve", Bolivia: "bo", Paraguay: "py", Ecuador: "ec",
  // North/Central America
  Mexico: "mx", USA: "us", "United States": "us", Canada: "ca", Panama: "pa",
  "Costa Rica": "cr", Jamaica: "jm", Haiti: "ht", "Cape Verde": "cv",
  // Africa
  Nigeria: "ng", Cameroon: "cm", Ghana: "gh", Senegal: "sn", Mali: "ml",
  "South Africa": "za", "DR Congo": "cd", Congo: "cd",
  // Asia
  Japan: "jp", "South Korea": "kr", "Korea Republic": "kr", Iran: "ir",
  Australia: "au", "New Zealand": "nz", Uzbekistan: "uz",
  // Other
  Turkey: "tr", Türkiye: "tr",
  "Bosnia-Herzegovina": "ba", "Bosnia and Herzegovina": "ba",
  "Côte d'Ivoire": "ci", "Ivory Coast": "ci", "Curaçao": "cw",
};

/**
 * Get the flag-icons country code for a team name.
 * Returns lowercase ISO code (e.g., "fr" for France).
 */
export function getFlagCode(team: string): string | null {
  if (!team) return null;
  // Direct match
  if (COUNTRY_ISO_MAP[team]) return COUNTRY_ISO_MAP[team];
  // Try case-insensitive
  const lower = team.toLowerCase();
  for (const [key, code] of Object.entries(COUNTRY_ISO_MAP)) {
    if (key.toLowerCase() === lower) return code;
  }
  return null;
}

/**
 * Convert a team name to a flag-icons CSS class.
 * Returns something like "fi fi-fr" or null.
 */
export function getFlagClass(team: string, style: "white" | "gold" | "normal" = "white"): string | null {
  const code = getFlagCode(team);
  if (!code) return null;
  const tint = style === "white" ? "fi-white" : style === "gold" ? "fi-gold" : "";
  return `fi fi-${code} ${tint}`.trim();
}
