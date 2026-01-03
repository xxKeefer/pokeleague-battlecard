<script setup lang="ts">
defineProps<{
  width?: number | string
  height?: number | string
}>()
</script>

<template>
  <svg
    :width="width ?? 176"
    :height="height ?? 96"
    viewBox="0 0 176 96"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- Lens glass -->
      <radialGradient id="lens-glass" cx="40%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#9fdcff" />
        <stop offset="35%" stop-color="#3aa2e6" />
        <stop offset="75%" stop-color="#0b4c8a" />
        <stop offset="100%" stop-color="#062b52" />
      </radialGradient>

      <!-- Lens highlight strip -->
      <linearGradient id="lens-gloss" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="white" stop-opacity="0.6" />
        <stop offset="40%" stop-color="white" stop-opacity="0.15" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>

      <!-- Outer bezel -->
      <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#222" />
        <stop offset="50%" stop-color="#111" />
        <stop offset="100%" stop-color="#000" />
      </linearGradient>
    </defs>

    <!-- shifted group so artwork fits tightly in viewBox -->
    <g transform="translate(-48 -20)">
      <!-- ===== Lens Assembly ===== -->

      <!-- Outer bezel ring -->
      <circle cx="90" cy="70" r="42" fill="url(#bezel)" />

      <!-- Inner ring -->
      <circle cx="90" cy="70" r="34" fill="#0f172a" />

      <!-- Glass -->
      <circle cx="90" cy="70" r="30" fill="url(#lens-glass)" />

      <!-- Gloss highlight -->
      <ellipse cx="78" cy="58" rx="12" ry="7" fill="url(#lens-gloss)" />

      <!-- Lens core reflection -->
      <circle cx="84" cy="64" r="4" fill="white" opacity="0.6" />

      <!-- ===== Indicator Lights ===== -->

      <!-- Red -->
      <circle cx="160" cy="32" r="10" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" />
      <circle cx="156" cy="28" r="4" fill="white" opacity="0.6" />

      <!-- Yellow -->
      <circle cx="185" cy="32" r="10" fill="#facc15" stroke="#854d0e" stroke-width="3" />
      <circle cx="181" cy="28" r="4" fill="white" opacity="0.6" />

      <!-- Green -->
      <circle cx="210" cy="32" r="10" fill="#22c55e" stroke="#065f46" stroke-width="3" />
      <circle cx="206" cy="28" r="4" fill="white" opacity="0.6" />
    </g>
  </svg>
</template>
