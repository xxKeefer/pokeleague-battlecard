<script setup lang="ts">
import TeamListItem from '@/components/TeamListItem.vue'
import { useTeamStore } from '@/stores/teamStore'

const team = useTeamStore()
</script>

<template>
  <ul class="flex flex-col gap-1">
    <TeamListItem
      v-for="slot in team.team"
      :position="slot.position"
      :pokemon="slot.pokemon"
      :key="slot.position"
    />
  </ul>
</template>
