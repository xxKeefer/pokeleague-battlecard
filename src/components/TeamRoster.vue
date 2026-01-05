<script setup lang="ts">
import PokedexScreen from '@/components/pokedex/PokedexScreen.vue'

import { useTeamStore } from '@/stores/teamStore'

const team = useTeamStore()
</script>

<template>
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
          class="flex flex-nowrap gap-1 place-self-center justify-self-start"
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
</template>
