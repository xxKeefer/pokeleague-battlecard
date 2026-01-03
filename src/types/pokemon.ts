import type { PokeAPI } from 'pokeapi-types'

type PokemonData = Pick<PokeAPI.Pokemon, 'name' | 'id' | 'stats'> & {
  sprite: string
  types: Typing[]
}

export interface TeamSlot {
  position: TeamPosition
  pokemon: PokemonData | null
}

export interface TrainerTeam {
  teamName: string
  trainerName: string
  team: TeamSlot[]
}
// Positions 7-10 are considered back ups
type TeamPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const TypeColors = {
  normal: 'bg-pkmn-normal',
  fire: 'bg-pkmn-fire',
  water: 'bg-pkmn-water',
  electric: 'bg-pkmn-electric',
  grass: 'bg-pkmn-grass',
  ice: 'bg-pkmn-ice',
  fighting: 'bg-pkmn-fighting',
  poison: 'bg-pkmn-poison',
  ground: 'bg-pkmn-ground',
  flying: 'bg-pkmn-flying',
  psychic: 'bg-pkmn-psychic',
  bug: 'bg-pkmn-bug',
  rock: 'bg-pkmn-rock',
  ghost: 'bg-pkmn-ghost',
  dragon: 'bg-pkmn-dragon',
  dark: 'bg-pkmn-dark',
  steel: 'bg-pkmn-steel',
  fairy: 'bg-pkmn-fairy',
} as const

type ValueOf<T> = T[keyof T]
export type TypeColor = ValueOf<typeof TypeColors>

export interface Typing {
  name: string
  color: TypeColor
}
