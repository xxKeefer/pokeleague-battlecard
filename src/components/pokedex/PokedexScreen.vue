<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="relative rounded-lg bg-gray-800 p-2">
    <div
      :class="[
        'z-50 h-full min-h-20 min-w-20 bg-[linear-gradient(165deg,_theme(colors.blue.400)_0%,_theme(colors.blue.200)_12%,_theme(colors.sky.300)_25%,_theme(colors.cyan.200)_38%,_theme(colors.blue.200)_52%,_theme(colors.blue.400)_65%,_theme(colors.sky.300)_78%,_theme(colors.cyan.200)_100%)] shadow-inner',
        $props.class,
      ]"
    >
      <slot />
    </div>
    <div
      class="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_6px,rgba(0,0,0,0.08)_7px)] opacity-70"
    />
  </div>
</template>
