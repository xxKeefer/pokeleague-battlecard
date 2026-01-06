<script setup lang="ts">
import { computed, ref } from 'vue'
import { toPng } from 'html-to-image'

import PokemonSearch from '@/components/PokemonSearch.vue'
import TeamList from '@/components/TeamList.vue'
import TeamDisplay from '@/components/TeamDisplay.vue'
import { useTeamStore } from '@/stores/teamStore'
import PokedexLens from '@/components/pokedex/PokedexLens.vue'
import TeamRoster from '@/components/TeamRoster.vue'
import TeamTypeChart from './components/TeamTypeChart.vue'
import PokedexScreen from './components/pokedex/PokedexScreen.vue'
import TeamStatChart from './components/TeamStatChart.vue'
import { PhInfo } from '@phosphor-icons/vue'
import { statTotals } from '@/helpers'

const team = useTeamStore()
const totals = computed(() => statTotals(team.team))
const sorted = computed(() => {
  return Object.entries(totals.value).sort((a, b) => a[1] - b[1])
})
const strongest = computed(() => sorted.value[5]!)
const weakest = computed(() => sorted.value[0]!)
console.log({ strongest: strongest.value, weakest: weakest.value })

const pokedexRef = ref<HTMLElement | null>(null)
const nameWidth = ref(565)

const savePokedexPng = async () => {
  if (!pokedexRef.value) return

  const dataUrl = await toPng(pokedexRef.value, {
    cacheBust: true,
    pixelRatio: 2, // nicer quality export
    backgroundColor: '#00000000', // matches Tailwind red-500
  })

  const link = document.createElement('a')
  link.download = 'trainer-battle-card.png'
  link.href = dataUrl
  link.click()
}
</script>

<template>
  <main class="p-4">
    <div class="flex gap-8 pb-4">
      <div class="flex flex-col gap-4">
        <PokemonSearch />
        <div class="flex items-center gap-2">
          <label for="wrapName">Trainer Name Wrap Length (px) </label>
          <input name="wrapName" v-model="nameWidth" class="border px-2" placeholder="565" />
        </div>
        <div
          class="flex w-md items-start justify-start gap-2 rounded border-2 border-cyan-500 bg-cyan-100 p-2"
        >
          <PhInfo :size="32" :weight="'fill'" class="shrink-0 text-cyan-500" />

          <span class="text-xs font-semibold"
            >If your team name is wrapping too early or jutting out past the graph, play with the
            Trainer Name Wrap Length number.
          </span>
        </div>
        <button
          class="mb-3 rounded-sm bg-slate-900 px-3 py-1 text-sm font-bold text-white hover:cursor-pointer hover:bg-slate-800"
          @click="savePokedexPng"
        >
          Save as PNG
        </button>
      </div>
      <TeamList />
    </div>
    <div ref="pokedexRef" class="w-fit bg-gray-200 p-2">
      <div class="w-fit rounded-sm border-4 border-red-400 bg-red-500 p-4 pt-2">
        <div class="flex gap-8">
          <PokedexLens class="pb-2" />
          <div
            :style="{ maxWidth: nameWidth + 'px' }"
            class="flex flex-col justify-center gap-1 py-2"
          >
            <span class="text-lg leading-0 font-semibold capitalize">{{ team.trainerName }}</span>
            <span class="text-6xl font-black uppercase">{{ team.teamName }}</span>
          </div>
        </div>

        <div class="flex w-fit gap-4">
          <TeamDisplay />
          <TeamRoster />
          <PokedexScreen class="flex flex-col items-center justify-start gap-8 p-2">
            <div class="flex flex-col items-center gap-2">
              <span class="font-mono text-sm leading-none font-semibold capitalize"
                >Type Breakdown</span
              >
              <div class="h-[164px] w-[164px]">
                <TeamTypeChart />
              </div>
            </div>
            <div class="flex flex-col items-center gap-0">
              <span class="font-mono text-sm leading-none font-semibold capitalize"
                >Aggregate Base Stats</span
              >
              <div class="h-[164px] w-[164px]">
                <TeamStatChart />
              </div>
              <div class="flex gap-1 text-xs font-semibold uppercase">
                <span class="rounded bg-lime-500 px-1 py-0.5 text-lime-900"
                  >{{ strongest[0] }}: {{ strongest[1] }}</span
                >
                <span class="rounded bg-red-300 px-1 py-0.5 text-red-900"
                  >{{ weakest[0] }}: {{ weakest[1] }}</span
                >
              </div>
            </div>
          </PokedexScreen>
        </div>
      </div>
    </div>
  </main>
</template>
