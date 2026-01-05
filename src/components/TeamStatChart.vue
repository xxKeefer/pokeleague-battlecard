<script setup lang="ts">
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { useTeamStore } from '@/stores/teamStore'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const teamStore = useTeamStore()

// Stat order we’ll use on the radar
const STAT_KEYS = ['hp', 'attack', 'defense', 'speed', 'special-defense', 'special-attack'] as const

const statTotals = computed(() => {
  const totals: Record<string, number> = {
    hp: 0,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 0,
    speed: 0,
  }

  for (const slot of teamStore.team) {
    if (!slot.pokemon) continue

    for (const stat of slot.pokemon.stats) {
      const key = stat.stat.name
      if (totals[key] !== undefined) {
        totals[key] += stat.base_stat
      }
    }
  }

  return totals
})

const chartData = computed(() => ({
  labels: ['HP', 'Atk', 'Def', 'Spd', 'Sp. Def', 'Sp. Atk'],

  datasets: [
    {
      label: 'x',
      data: STAT_KEYS.map((k) => statTotals.value[k] ?? 0),
      backgroundColor: 'rgba(100, 100, 100, 0.25)',
      borderColor: 'rgb(100, 100, 100)',
      pointBackgroundColor: 'rgba(100, 100, 100, 1)',

      borderWidth: 2,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },

  scales: {
    r: {
      beginAtZero: true,
      ticks: {
        display: false,
      },
      grid: {
        circular: false,
        color: 'rgba(0, 0, 0, 0.25)',
      },
      pointLabels: {
        color: 'rgba(0, 0, 0, 1)',
      },
    },
  },
}
</script>

<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>
