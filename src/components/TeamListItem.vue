<script setup lang="ts">
import { useTeamStore } from '@/stores/teamStore'
import { type TeamSlot } from '@/types/pokemon'
import { PhTrash, PhArrowLineUp, PhArrowLineDown } from '@phosphor-icons/vue'
import DisplayPokemon from './DisplayPokemon.vue'

const props = defineProps<{ position: TeamSlot['position']; pokemon: TeamSlot['pokemon'] }>()

const team = useTeamStore()

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
  <div v-if="pokemon" class="flex items-stretch gap-2 rounded-sm border-2 border-gray-300 p-0.5">
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
</template>

<!-- 
TODO:
3. add pokedex layout for team, inc. team name trainer name
4. add pie chart for types
5. add radio chart for total stats
6. add gradient separators
-->
