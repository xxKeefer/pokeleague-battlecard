import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { type TrainerTeam, type TeamSlot, TypeColors, type Typing } from '@/types/pokemon'
import type { PokeAPI } from 'pokeapi-types'

const MAX_SLOTS = 10 as const

export const useTeamStore = defineStore('team', () => {
  const teamName = ref<TrainerTeam['teamName']>('Surf Squad')
  const trainerName = ref<TrainerTeam['trainerName']>("Misty's")

  const team = ref<TeamSlot[]>([])

  function setPokemon(newPokemon: PokeAPI.Pokemon) {
    if (team.value.length >= MAX_SLOTS) return

    const { name, id, sprites, stats, types } = newPokemon

    const processedTypes: Typing[] = types.map((x) => ({
      name: x.type.name,
      color: TypeColors[x.type.name as keyof typeof TypeColors],
    }))

    const pokemon: TeamSlot['pokemon'] = {
      name: name.split('-')[0] ?? '',
      id,
      stats,
      types: processedTypes,
      sprite: sprites.front_default,
    }

    team.value.push({
      pokemon,
      // temp position — watcher will normalize
      position: 0 as TeamSlot['position'],
    })
  }

  function clearPokemon(position: TeamSlot['position']) {
    team.value = team.value.filter((x) => x.position !== position)
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
    setPokemon,
    clearPokemon,
    positionAt,
    shiftUp,
    shiftDown,
  }
})
