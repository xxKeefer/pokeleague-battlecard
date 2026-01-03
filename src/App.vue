<script setup lang="ts">
import { ref } from 'vue'
import { toPng } from 'html-to-image'

import PokemonSearch from '@/components/PokemonSearch.vue'
import TeamList from '@/components/TeamList.vue'
import TeamDisplay from './components/TeamDisplay.vue'
import PokedexScreen from './components/pokedex/PokedexScreen.vue'
import { useTeamStore } from './stores/teamStore'
import PokedexLens from './components/pokedex/PokedexLens.vue'

const team = useTeamStore()

const pokedexRef = ref<HTMLElement | null>(null)

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
          <div class="flex max-w-[565px] flex-col justify-center gap-1 pb-2">
            <span class="text-xl font-semibold capitalize">{{ team.trainerName }}</span>
            <span class="text-4xl font-black uppercase">{{ team.teamName }}</span>
          </div>
        </div>
        <div class="flex w-fit gap-4">
          <TeamDisplay />
          <PokedexScreen class="px-4 py-2">
            <div class="a z-50 grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1">
              <template v-for="slot in team.team" :key="slot.position">
                <!-- Column 1: name -->

                <div v-if="slot.pokemon" class="flex flex-col gap-0">
                  <span
                    :class="[
                      'm-0 leading-snug font-extrabold capitalize',
                      slot.pokemon?.nickname ? 'text-lg' : 'text-2xl',
                    ]"
                    >{{ slot.pokemon.nickname ?? slot.pokemon.name }}</span
                  >
                  <span
                    v-if="slot.pokemon.nickname"
                    class="font-mono text-sm leading-none font-semibold capitalize"
                    >{{ slot.pokemon.name }}</span
                  >
                </div>

                <!-- Column 2: chips -->
                <div
                  v-if="slot.pokemon"
                  class="flex flex-wrap gap-1 place-self-center justify-self-start"
                >
                  <span
                    v-for="typing in slot.pokemon.types"
                    :key="typing.name"
                    :class="[
                      'text-md z-50 w-min min-w-24 rounded-sm border border-cyan-950 px-2 py-0.5 text-center font-bold text-white uppercase',
                      typing.color,
                    ]"
                  >
                    {{ typing.name }}
                  </span>
                </div>
              </template>
            </div>
          </PokedexScreen>
        </div>
      </div>
    </div>
  </main>
</template>
