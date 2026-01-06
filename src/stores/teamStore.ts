import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  type TrainerTeam,
  type TeamSlot,
  TypeColors,
  type Typing,
  TypeHexColors,
} from '@/types/pokemon'
import type { PokeAPI } from 'pokeapi-types'
import { fetchEndpoint } from '@/api/pokeApi'

const MAX_SLOTS = 10 as const

export const useTeamStore = defineStore('team', () => {
  const teamName = ref<TrainerTeam['teamName']>('Surf Squad')
  const trainerName = ref<TrainerTeam['trainerName']>("Misty's")

  const team = ref<TeamSlot[]>([])

  const statTotals = computed(() => {
    const totals: Record<string, number> = {
      hp: 0,
      attack: 0,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 0,
    }

    for (const slot of team.value) {
      if (!slot.pokemon) continue

      for (const stat of slot.pokemon.stats) {
        const key = stat.stat.name
        if (totals[key] !== undefined) {
          totals[key] += stat.base_stat
        }
      }
    }

    return totals
  })

  async function setPokemon(newPokemon: PokeAPI.Pokemon, position?: TeamSlot['position']) {
    // fetch species for variants
    const species = await fetchEndpoint<PokeAPI.PokemonSpecies>(newPokemon.species.url)
    const varieties = species.varieties.map((v) => v.pokemon)

    const processedTypes: Typing[] = newPokemon.types.map((x) => ({
      name: x.type.name,
      color: TypeColors[x.type.name as keyof typeof TypeColors],
      hex: TypeHexColors[x.type.name as keyof typeof TypeHexColors],
    }))

    const pokemonData: TeamSlot['pokemon'] = {
      name: newPokemon.name.split('-').join(' '),
      id: newPokemon.id,
      stats: newPokemon.stats,
      types: processedTypes,
      sprite: newPokemon.sprites.front_default,
      species: newPokemon.species,
      varieties,
    }

    if (position !== undefined) {
      const target = team.value.find((x) => x.position === position)!
      target.pokemon = { ...pokemonData, nickname: target.pokemon?.nickname }
    } else {
      team.value.push({ pokemon: pokemonData, position: 0 as TeamSlot['position'] })
    }
  }

  function at(position: TeamSlot['position']) {
    return team.value.find((x) => x.position === position)!.pokemon!
  }

  function clearPokemon(position: TeamSlot['position']) {
    team.value = team.value.filter((x) => x.position !== position)
  }

  function updateNickname(position: TeamSlot['position'], nickname: string) {
    const target = team.value.find((x) => x.position === position)!
    target.pokemon!.nickname = nickname === '' ? undefined : nickname
  }
  function overrideName(position: TeamSlot['position'], name: string) {
    const target = team.value.find((x) => x.position === position)!
    target.pokemon!.name = name
  }

  function clampPosition(position: number): TeamSlot['position'] {
    const clamped = Math.min(Math.max(position, 1), MAX_SLOTS)
    return clamped as TeamSlot['position']
  }

  function findByPosition(position: TeamSlot['position']) {
    return team.value.find((s) => s.position === position) ?? null
  }

  /**
   * Move slot to a new position.
   * Shifts other slots to make room.
   */
  function positionAt(from: TeamSlot['position'], to: TeamSlot['position']) {
    if (from === to) return

    const target = clampPosition(to)
    const slot = findByPosition(from)
    if (!slot) return

    const others = team.value.filter((s) => s.position !== from)

    // shift slots in affected range
    if (from < target) {
      // moving downward → shift range (from, target] upward
      for (const pokemon of others) {
        if (pokemon.position > from && pokemon.position <= target) {
          pokemon.position = clampPosition(pokemon.position - 1)
        }
      }
    } else {
      // moving upward → shift range [target, from) downward
      for (const pokemon of others) {
        if (pokemon.position >= target && pokemon.position < from) {
          pokemon.position = clampPosition(pokemon.position + 1)
        }
      }
    }

    slot.position = target

    // rewrite sorted array
    team.value = [...others, slot].sort((a, b) => a.position - b.position)
  }

  /**
   * Move slot up one position (if possible)
   */
  function shiftUp(position: TeamSlot['position']) {
    if (position <= 1) return // already at top
    positionAt(position, (position - 1) as TeamSlot['position'])
  }

  /**
   * Move slot down one position (if possible)
   */
  function shiftDown(position: TeamSlot['position']) {
    if (position >= MAX_SLOTS) return // already at bottom
    positionAt(position, (position + 1) as TeamSlot['position'])
  }

  // Auto-normalize slot numbers whenever team changes
  watch(
    team,
    (slots) => {
      slots.forEach((slot, i) => {
        slot.position = (i + 1) as TeamSlot['position']
      })
    },
    { deep: true },
  )

  return {
    teamName,
    trainerName,
    team,
    statTotals: statTotals.value,
    setPokemon,
    at,
    clearPokemon,
    updateNickname,
    overrideName,
    positionAt,
    shiftUp,
    shiftDown,
  }
})
