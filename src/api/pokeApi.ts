import type { PokeAPI } from 'pokeapi-types'

const API = 'https://pokeapi.co/api/v2/'

export async function fetchPokemon(nameOrId: string): Promise<PokeAPI.Pokemon> {
  const res = await fetch(`${API}/pokemon/${nameOrId.toLowerCase()}`)

  if (!res.ok) {
    throw new Error('Pokemon not found')
  }

  return await res.json()
}
export async function fetchPokemonSpecies(id: string): Promise<PokeAPI.PokemonSpecies> {
  const res = await fetch(`${API}/pokemon-species/${id}`)

  if (!res.ok) {
    throw new Error('Pokemon not found')
  }

  return await res.json()
}
export async function fetchEndpoint(endpoint: string): Promise<PokeAPI.Pokemon> {
  const res = await fetch(endpoint)

  if (!res.ok) {
    throw new Error('Pokemon not found')
  }

  return await res.json()
}
