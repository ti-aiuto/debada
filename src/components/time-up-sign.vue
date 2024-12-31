<script setup lang="ts">
import { ref } from 'vue'

import timeUpImage from '../assets/sprites/time-up.png';

const imageClass = ref('');

function show() {
  imageClass.value = 'image-visible';
}

defineExpose({ show });
</script>

<template>
  <img :src="timeUpImage" class="image" :class="imageClass">
</template>

<style scoped>
.image {
  width: 571px;
  height: 299px;
  opacity: 0;
}

@keyframes image-animate {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.image-visible {
  animation-name: image-animate;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
</style>
