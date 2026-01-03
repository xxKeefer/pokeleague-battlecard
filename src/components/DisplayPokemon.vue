<script setup lang="ts">
import { useTeamStore } from '@/stores/teamStore'
import { type TeamSlot } from '@/types/pokemon'
import { computed } from 'vue'

const props = defineProps<{ position: TeamSlot['position'] }>()

const team = useTeamStore()
const pokemon = computed(() => {
  return team.team.find((x) => x.position === props.position)?.pokemon
})
</script>

<template>
  <div v-if="pokemon" class="flex items-stretch gap-2 px-2">
    <div class="flex items-center justify-start gap-2">
      <span class="text-xl font-extrabold capitalize">{{ pokemon.name }}</span>
      <div class="flex gap-1">
        <span
          v-for="typing in pokemon.types"
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
</template>
