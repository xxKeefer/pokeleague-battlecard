<script setup lang="ts">
import { useTeamStore } from '@/stores/teamStore'
import { type TeamSlot } from '@/types/pokemon'
import { PhTrash, PhArrowLineUp, PhArrowLineDown } from '@phosphor-icons/vue'
import DisplayPokemon from './DisplayPokemon.vue'
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchEndpoint, fetchPokemonSpecies } from '@/api/pokeApi'

const props = defineProps<{ position: TeamSlot['position']; pokemon: TeamSlot['pokemon'] }>()

const team = useTeamStore()

const species = useQuery({
  queryKey: ['species', props.pokemon?.id],
  queryFn: () => fetchPokemonSpecies(props.pokemon?.id + ''),
  enabled: !!props.pokemon?.id, // only runs when text is non-empty
  retry: false,
})

const variations = computed(() => {
  return species.data.value?.varieties.map((x) => x.pokemon) ?? []
})

const selectedVariation = ref<string | null>(props.pokemon?.name ?? null)
const variantUrl = computed(() => {
  return variations.value.find((x) => x.name === selectedVariation.value)?.url ?? null
})

const selectedVariant = useQuery({
  queryKey: computed(() => ['byEndpoint', variantUrl.value]),
  queryFn: () => fetchEndpoint(variantUrl.value!),
  enabled: computed(() => !!variantUrl.value),
  retry: false,
})

watch(
  () => selectedVariant.data.value,
  (next) => {
    console.log(next)
    if (!next) return
    team.setPokemon(next, props.position)
  },
)

const nickname = ref('')
const nameOverride = ref(props.pokemon?.name ?? '')

watch(nickname, (next) => team.updateNickname(props.position, next))
watch(nameOverride, (next) => team.overrideName(props.position, next))

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
        <select
          v-if="variations.length"
          name="variant"
          v-model="selectedVariation"
          class="mr-2 border px-2"
        >
          <option v-for="poke in variations" :key="poke.name" :value="poke.name">
            {{ poke.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<!-- 
TODO:
3. add pokedex layout for team, inc. team name trainer name
4. add pie chart for types
5. add radio chart for total stats
6. add gradient separators
-->
