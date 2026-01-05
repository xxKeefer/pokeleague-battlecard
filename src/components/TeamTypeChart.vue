<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import { useTeamStore } from '@/stores/teamStore'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)
const teamStore = useTeamStore()

const typeTotals = computed(() => {
  const totals: Record<string, { count: number; color: string }> = {}

  for (const slot of teamStore.team) {
    if (!slot.pokemon) continue

    for (const t of slot.pokemon.types) {
      if (!totals[t.name]) {
        totals[t.name] = { count: 0, color: t.hex }
      }
      totals[t.name]!.count++
    }
  }

  return totals
})

const chartData = computed(() => {
  const labels = Object.keys(typeTotals.value)

  const counts = labels.map((l) => typeTotals.value[l]!.count)
  const colors = labels.map((l) => typeTotals.value[l]!.color)

  return {
    // labels,
    datasets: [
      {
        label: 'Type Distribution',
        data: counts,
        backgroundColor: colors,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.25)',
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>
