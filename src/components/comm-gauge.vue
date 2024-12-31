<script setup lang="ts">
import gauge3Image from '../assets/sprites/gauge3.png';
import gauge4Image from '../assets/sprites/gauge4.png';
import gauge5Image from '../assets/sprites/gauge5.png';

import { computed } from 'vue'

const { commPoint } = defineProps({
  commPoint: Number
})

const gaugeImageUrl = computed(() => {
  if (commPoint === 5) {
    return gauge5Image;
  } else if (commPoint === 4) {
    return gauge4Image;
  } else {
    return gauge3Image;
  }
})

</script>

<template>
  <img :src="gaugeImageUrl" class="gauge">
</template>

<style scoped>
.gauge {
  width: 380px;
  height: 22px;
}
</style>
