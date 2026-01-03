<script setup lang="ts">
import { useTeamStore } from '@/stores/teamStore'
import TeamLayout from '@/components/team-layout'
import { computed } from 'vue'
import PokedexScreen from './pokedex/PokedexScreen.vue'

const team = useTeamStore()

const rowOne = computed(() => {
  return team.team.filter((x) => [1, 2, 3].includes(x.position))
})
const rowTwo = computed(() => {
  return team.team.filter((x) => [4, 5, 6].includes(x.position))
})
const rowThree = computed(() => {
  return team.team.filter((x) => [7, 8, 9, 10].includes(x.position))
})
</script>

<template>
  <PokedexScreen>
    <TeamLayout>
      <TeamLayout.MainRow>
        <img
          v-for="mon in rowOne"
          :key="mon.pokemon?.id"
          :src="mon.pokemon?.sprite"
          class="z-50 h-[123px] w-auto"
        />
      </TeamLayout.MainRow>
      <TeamLayout.MainRow>
        <img
          v-for="mon in rowTwo"
          :key="mon.pokemon?.id"
          :src="mon.pokemon?.sprite"
          class="z-50 h-[123px] w-auto"
        />
      </TeamLayout.MainRow>
      <TeamLayout.BackUpRow>
        <img
          v-for="mon in rowThree"
          :key="mon.pokemon?.id"
          :src="mon.pokemon?.sprite"
          class="z-50 h-[92px] w-auto"
        />
      </TeamLayout.BackUpRow>
    </TeamLayout>
  </PokedexScreen>
</template>
