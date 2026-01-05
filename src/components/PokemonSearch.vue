<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchPokemon } from '@/api/pokeApi'
import { useTeamStore } from '@/stores/teamStore'
import { TypeColors } from '@/types/pokemon'
import { PhQuestion, PhInfo } from '@phosphor-icons/vue'

const team = useTeamStore()
const queryText = ref('')

const enabled = computed(() => queryText.value.length > 0)

const { data, isLoading, isError } = useQuery({
  queryKey: ['pokemon', queryText],
  queryFn: () => fetchPokemon(queryText.value),
  enabled, // only runs when text is non-empty
  retry: false,
})

const types = computed(() => {
  return data.value?.types.map((x) => ({
    name: x.type.name,
    color: TypeColors[x.type.name as keyof typeof TypeColors],
  }))
})

function applyResult() {
  if (!data.value) return
  team.setPokemon(data.value)
  queryText.value = ''
}
</script>

<template>
  <div class="flex flex-col items-center gap-2 pb-4">
    <div class="flex items-center gap-2">
      <label for="trainer">Trainer Name </label>
      <input
        name="trainer"
        v-model="team.trainerName"
        class="border px-2"
        placeholder="Keefy Boi's"
      />
    </div>
    <div class="flex items-center gap-2">
      <label for="teamName">Team Name </label>
      <input
        name="teamName"
        v-model="team.teamName"
        class="border px-2"
        placeholder="Slamajamma's"
      />
    </div>
    <div class="flex items-center gap-2">
      <label for="pokesearch">Poke Search </label>
      <input
        name="pokesearch"
        v-model="queryText"
        class="border px-2"
        placeholder="pikachu / 25"
        @keyup.enter="applyResult"
      />
    </div>
    <div
      class="flex w-md items-start justify-start gap-2 rounded border-2 border-cyan-500 bg-cyan-100 p-2"
    >
      <PhInfo :size="32" :weight="'fill'" class="shrink-0 text-cyan-500" />

      <span class="text-xs font-semibold"
        >If the pokemon you are searching for has a form (regional, stance, etc...) I recommend to
        search via id, or add the suffix
        <pre class="inline w-min rounded bg-yellow-300 px-1 py-0.5 font-mono">-{form}</pre>
        to the name. eg:
        <pre class="inline w-min rounded bg-yellow-300 px-1 py-0.5 font-mono">charizard-mega-x</pre>
      </span>
    </div>
    <button
      class="w-full rounded-sm bg-slate-900 px-3 py-1 text-sm font-bold text-white hover:cursor-pointer hover:bg-slate-800"
      :disabled="isLoading || !data"
      @click="applyResult"
    >
      Add
    </button>

    <span v-if="isLoading">Searching…</span>
    <span v-if="isError" class="text-red-500"> Not found </span>
    <div
      v-if="data"
      class="flex items-stretch gap-2 rounded-sm border-2 border-gray-300 py-0.5 pr-2"
    >
      <img :src="data.sprites.front_default" />
      <div class="flex flex-col justify-start gap-2">
        <span class="text-xl font-extrabold capitalize">{{ data.name }}</span>
        <div class="flex flex-col gap-0.5">
          <span
            v-for="typing in types"
            :key="typing.name"
            :class="[
              'w-min min-w-20 rounded-sm px-2 py-0.5 text-center text-xs font-bold text-white uppercase',
              typing.color,
            ]"
            >{{ typing.name }}</span
          >
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex min-h-[100px] max-w-[200px] flex-col items-stretch gap-2 rounded-sm border-2 border-gray-300 p-2"
    >
      <div class="flex gap-2">
        <PhQuestion :size="32" />
        <div class="flex flex-col justify-start gap-2">
          <span class="text-xl font-extrabold capitalize">Searching...</span>
        </div>
      </div>
    </div>
  </div>
</template>
