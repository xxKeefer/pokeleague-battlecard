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
import { STAT_KEYS, statTotals } from '@/helpers'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const teamStore = useTeamStore()

const totals = computed(() => statTotals(teamStore.team))

const chartData = computed(() => ({
  labels: ['HP', 'Atk', 'Def', 'Spd', 'Sp. Def', 'Sp. Atk'],

  datasets: [
    {
      label: 'x',
      data: STAT_KEYS.map((k) => totals.value[k] ?? 0),
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
