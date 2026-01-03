<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="['grid grid-cols-3 justify-items-center gap-4', $props.class]">
    <slot />
  </div>
</template>
