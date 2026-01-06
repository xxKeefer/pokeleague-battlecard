import type { TeamSlot } from '@/types/pokemon'

export const STAT_KEYS = [
  'hp',
  'attack',
  'defense',
  'speed',
  'special-defense',
  'special-attack',
] as const
type StatTotals = Record<(typeof STAT_KEYS)[number], number>
export function statTotals(team: TeamSlot[]): StatTotals {
  const totals: Record<string, number> = {
    hp: 0,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 0,
    speed: 0,
  }

  for (const slot of team) {
    if (!slot.pokemon) continue

    for (const stat of slot.pokemon.stats) {
      const key = stat.stat.name
      if (totals[key] !== undefined) {
        totals[key] += stat.base_stat
      }
    }
  }

  return totals as StatTotals
}
