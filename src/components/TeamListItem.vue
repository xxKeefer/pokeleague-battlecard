<script setup lang="ts">
import { useTeamStore } from '@/stores/teamStore'
import { type TeamSlot } from '@/types/pokemon'
import { PhTrash, PhArrowLineUp, PhArrowLineDown } from '@phosphor-icons/vue'
import DisplayPokemon from './DisplayPokemon.vue'
import { computed } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { fetchEndpoint } from '@/api/pokeApi'

const props = defineProps<{ position: TeamSlot['position'] }>()
const team = useTeamStore()

const pokemon = computed(() => team.at(props.position))

const variantOptions = computed(() => pokemon.value.varieties ?? [])

const variantMutation = useMutation({
  mutationFn: (url: string) => fetchEndpoint<PokeAPI.PokemonSpecies>(url),
  onSuccess: (newPokemon) => {
    team.setPokemon(newPokemon, props.position)
  },
})

function onVariantChange(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target) return
  const url = target.value
  if (!url) return
  variantMutation.mutate(url)
}

const nickname = computed({
  get: () => pokemon.value?.nickname ?? '',
  set: (v: string) => team.updateNickname(props.position, v),
})

const nameOverride = computed({
  get: () => pokemon.value?.name ?? '',
  set: (v: string) => team.overrideName(props.position, v),
})

function clear() {
  team.clearPokemon(props.position)
}

function moveUp() {
  team.shiftUp(props.position)
}
function moveDown() {
  team.shiftDown(props.position)
}
</script>

<template>
  <div
    v-if="pokemon"
    class="flex flex-col items-stretch gap-2 rounded-sm border-2 border-gray-300 p-0.5"
  >
    <div class="flex gap-2">
      <DisplayPokemon :position="position" />
      <div class="ml-auto flex">
        <button class="bg-gray-600 px-2 py-1 hover:bg-gray-400" @click="moveUp">
          <PhArrowLineUp />
        </button>
        <button class="bg-gray-600 px-2 py-1 hover:bg-gray-400" @click="moveDown">
          <PhArrowLineDown />
        </button>
        <button class="bg-red-600 px-2 py-1 hover:bg-red-400" @click="clear">
          <PhTrash />
        </button>
      </div>
    </div>

    <div class="flex gap-2">
      <div class="mr-2 flex items-center gap-2">
        <label for="nickname">Nickname </label>
        <input name="nickname" v-model="nickname" class="border px-2" placeholder="Spot" />
      </div>
      <div class="mr-2 flex items-center gap-2">
        <label for="override">Name Override</label>
        <input name="override" v-model="nameOverride" class="border px-2" placeholder="Spot" />
      </div>
      <div class="mr-2 flex items-center gap-2">
        <label for="variant">Variant Form </label>
        <select v-if="variantOptions.length" class="mr-2 border px-2" @change="onVariantChange">
          <option v-for="v in variantOptions" :key="v.name" :value="v.url">
            {{ v.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
