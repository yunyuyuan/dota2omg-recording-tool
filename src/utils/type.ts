export type Hero = {
  id: number;
  name: string;
  nameCN: string;
  nameEN: string;
  abilities: Ability[];
}

export type Ability = {
  name: string;
  nameCN: string;
}

export type Config = {
  size: number;
  gapX: number;
  gapY: number;
  paddingX: number;
  paddingY: number;
  roundedHero: number;
  roundedAbility: number;
}

export const DefaultConfig: Config = {
  size: 64,
  gapX: 2,
  gapY: 2,
  paddingX: 0,
  paddingY: 0,
  roundedHero: 12,
  roundedAbility: 8
}

export const ConfigRange = {
  size: [24, 258],
  gapX: [0, 24],
  gapY: [0, 24],
  paddingX: [0, 100],
  paddingY: [0, 100],
  roundedHero: [0, 16],
  roundedAbility: [0, 12]
} as Record<string, [number, number]>

export const ConfigNames = {
  size: 'Size',
  gapX: 'Horizontal Spacing',
  gapY: 'Vertical Spacing',
  paddingX: 'Horizontal Padding',
  paddingY: 'Vertical Padding',
  roundedHero: 'Hero Rounded',
  roundedAbility: 'Ability Rounded'
} as Record<string, string>

export type Choose = {heroIndex: number, abilityIndex: number}