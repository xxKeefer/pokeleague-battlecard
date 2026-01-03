import type { PokeAPI } from 'pokeapi-types'

const API = 'https://pokeapi.co/api/v2/pokemon'

export async function fetchPokemon(nameOrId: string): Promise<PokeAPI.Pokemon> {
  const res = await fetch(`${API}/${nameOrId.toLowerCase()}`)

  if (!res.ok) {
    throw new Error('Pokemon not found')
  }

  return await res.json()
}
