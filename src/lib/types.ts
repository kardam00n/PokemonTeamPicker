export interface Pokemon {
  id: number;
  /** API slug, e.g. "charizard-mega-x" */
  name: string;
  /** Human-readable name, e.g. "Charizard (Mega X)" */
  displayName: string;
  /** Base species slug, e.g. "charizard" */
  baseName: string;
  /** True if this is the default/base form */
  isDefault: boolean;
  types: string[];
  sprite: string | null;
}

export type TypeChart = Record<string, string[]>;

export interface CoverageResult {
  /** enemy type being attacked */
  enemyType: string;
  /** list of Pokémon in team that deal ×2 to this type */
  attackers: Pokemon[];
}
